'use strict';

const win = nw.Window.get();

class Microsoft {
  constructor(accDB){
    this.db = accDB;
    this.loading = document.querySelector(".loading-bg");
    this.information = document.querySelector(".loading-bg .information");
  }

  async authenticate(popup){
    this.information.textContent = "En attente de Microsoft";
    this.loading.classList.toggle("show");

    //Remove all live.com cookies
    await new Promise((resolve) => {
      win.cookies.getAll({domain: "live.com"}, async (cookies) => {
        for await (let cookie of cookies){
          let url = `http${cookie.secure ? "s" : ""}://${cookie.domain.replace(/$\./, "") + cookie.path}`;
          win.cookies.remove({ url: url, name: cookie.name });
        }
        return resolve();
      });
    });

    //Get the code
    let code = await new Promise((resolve) => {
      nw.Window.open("https://login.live.com/oauth20_authorize.srf?client_id=00000000402b5328&response_type=code&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf", {
        "title": "Se connecter à votre compte Microsoft",
        "width": 1000,
        "height": 620,
        "frame": true,
        "position": "center",
        "icon": "app/assets/images/icons/icon.png"
      }, (Window) => {
        let interval = null;
        let code;
        interval = setInterval(() => {
          if(Window.window.document.location.href.startsWith("https://login.live.com/oauth20_desktop.srf")){
            clearInterval(interval);
            try {
              code = Window.window.document.location.href.split("code=")[1].split("&")[0];
            } catch(e){
              code = "cancel";
            }
            Window.close();
          }
        }, 100);

        Window.on('closed', () => {
          if(!code) code = "cancel";
          if(interval) clearInterval(interval);
          resolve(code);
        });
      });
    });

    if(code == "cancel"){
      this.loading.classList.toggle("show");
      return {cancel: true};
    }

    this.information.textContent = "Récupération des informations Microsoft";

    // Get tokens
    let oauth2 = await fetch("https://login.live.com/oauth20_token.srf", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `client_id=00000000402b5328&code=${code}&grant_type=authorization_code&redirect_uri=https://login.live.com/oauth20_desktop.srf&scope=service::user.auth.xboxlive.com::MBI_SSL`
    }).then(res => res.json());

    let refresh_date = new Date().getTime() + oauth2.expires_in * 1000;

    this.information.textContent = "Récupération des informations Xbox Live";

    let xbl = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: oauth2.access_token
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT"
      })
    }).then(res => res.json());

    let xsts = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [
            xbl.Token
          ]
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT"
      })
    }).then(res => res.json());

    let uhs = xbl.DisplayClaims.xui[0].uhs;

    this.information.textContent = "Connection aux services de Minecraft";

    let mcLogin = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "identityToken": `XBL3.0 x=${uhs};${xsts.Token}` })
    }).then(res => res.json());

    this.information.textContent = "Vérification du Jeu";

    //Check if the player have the game
    let hasGame = await fetch("https://api.minecraftservices.com/entitlements/mcstore", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${mcLogin.access_token}`
      }
    }).then(res => res.json());

    if(!hasGame.items.find(i => i.name == "product_minecraft" || i.name == "game_minecraft")){
      this.loading.classList.toggle("show");
      popup.showPopup("Jeu non trouvé", "Vous n'avez pas Minecraft sur votre compte Microsoft<br>Merci de vous connectez à un compte Microsoft ayant le jeu Minecraft", "warning", {value: "Ok"});
      return {cancel: true};
    }

    this.information.textContent = "Récupération des informations sur votre profile";

    //Get the profile
    let profile = await fetch("https://api.minecraftservices.com/minecraft/profile", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${mcLogin.access_token}`
      }
    }).then(res => res.json());

    this.db.add(profile.id, profile.name, profile.id, mcLogin.access_token, "microsoft", oauth2.refresh_token, refresh_date);
    this.loading.classList.toggle("show");
    return {username: profile.name, uuid: profile.id, email: profile.id};
  }

  async refresh(uuid){
    let acc = await this.db.get(uuid);

    if(new Date().getTime() < acc.refresh_date){
      let profile = await fetch("https://api.minecraftservices.com/minecraft/profile", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${acc.token}`
        }
      }).then(res => res.json());

      this.db.update(uuid, {username: profile.name, email: profile.id});
      return {username: profile.name, uuid: profile.id, email: profile.id};
    }

    let oauth2 = await fetch("https://login.live.com/oauth20_token.srf", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=refresh_token&client_id=00000000402b5328&scope=service::user.auth.xboxlive.com::MBI_SSL&refresh_token=${acc.refresh_token}`
    }).then(res => res.json());

    let refresh_date = new Date().getTime() + oauth2.expires_in * 1000;

    let xbl = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: oauth2.access_token
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT"
      })
    }).then(res => res.json());

    let xsts = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [
            xbl.Token
          ]
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT"
      })
    }).then(res => res.json());

    let uhs = xbl.DisplayClaims.xui[0].uhs;

    let mcLogin = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "identityToken": `XBL3.0 x=${uhs};${xsts.Token}` })
    }).then(res => res.json());

    let profile = await fetch("https://api.minecraftservices.com/minecraft/profile", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${mcLogin.access_token}`
      }
    }).then(res => res.json());

    this.db.update(uuid, {username: profile.name, email: profile.id, token: mcLogin.access_token, refresh_token: oauth2.refresh_token, refresh_date});
    return {username: profile.name, uuid: profile.id, email: profile.id};
  }

  async invalidate(uuid){
    this.db.delete(uuid);
    return true;
  }
}

export default Microsoft;
