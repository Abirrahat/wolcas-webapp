/****************************************************************************
 * WOLCAS – Single‑File App Bundle (GitHub Pages Compatible)
 ****************************************************************************/

const WOLCAS_CONFIG = {
  clientId: "827656f8-3a21-4d69-b6e5-c35e2ec2fb71",
  tenantId: "97d84781-b85c-4034-a0d0-588e7b442e45",
  redirectUri: "https://abirrahat.github.io/wolcas-webapp/auth",
  graphBase: "https://graph.microsoft.com/v1.0",
  scopes: ["User.Read","Sites.ReadWrite.All","Files.ReadWrite.All"]
};

const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: WOLCAS_CONFIG.clientId,
    authority: `https://login.microsoftonline.com/${WOLCAS_CONFIG.tenantId}`,
    redirectUri: WOLCAS_CONFIG.redirectUri,
    navigateToLoginRequestUrl: false
  },
  cache: { cacheLocation: "sessionStorage" }
});

const $ = id => document.getElementById(id);

function showSignedOut(){ $("signedOutMain").classList.remove("hidden"); $("appMain").classList.add("hidden"); $("btnSignIn").classList.remove("hidden"); $("btnSignOut").classList.add("hidden"); $("userEmail").textContent=""; }
function showSignedIn(a){ $("signedOutMain").classList.add("hidden"); $("appMain").classList.remove("hidden"); $("btnSignIn").classList.add("hidden"); $("btnSignOut").classList.remove("hidden"); $("userEmail").textContent=a.username||""; }

function getRole(){ const r=msalInstance.getActiveAccount()?.idTokenClaims?.roles||[]; if(r.includes('admin'))return 'admin'; if(r.includes('editor'))return 'editor'; return 'viewer'; }
function applyRBAC(){ const role=getRole(); document.querySelectorAll('.rbac-admin').forEach(e=>e.style.display=role==='admin'?'':'none'); document.querySelectorAll('.rbac-not-viewer').forEach(e=>e.style.display=role==='viewer'?'none':''); }

async function signIn(){ const r=await msalInstance.loginPopup({scopes:WOLCAS_CONFIG.scopes}); msalInstance.setActiveAccount(r.account); showSignedIn(r.account); applyRBAC(); }
async function signOut(){ await msalInstance.logoutPopup({mainWindowRedirectUri:"https://abirrahat.github.io/wolcas-webapp/"}); showSignedOut(); }

async function getToken(){ const a=msalInstance.getActiveAccount(); const r=await msalInstance.acquireTokenSilent({scopes:WOLCAS_CONFIG.scopes,account:a}); return r.accessToken; }
async function graphFetch(p,o={}){ const t=await getToken(); const r=await fetch(`${WOLCAS_CONFIG.graphBase}${p}`,{...o,headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json'}}); if(!r.ok)throw new Error(await r.text()); return r.json(); }

document.addEventListener('DOMContentLoaded',async()=>{
  $("btnSignIn").onclick=signIn;
  $("btnSignInCard").onclick=signIn;
  $("btnSignOut").onclick=signOut;
  await msalInstance.initialize();
  const acc=msalInstance.getAllAccounts();
  acc.length?(msalInstance.setActiveAccount(acc[0]),showSignedIn(acc[0]),applyRBAC()):showSignedOut();
});
