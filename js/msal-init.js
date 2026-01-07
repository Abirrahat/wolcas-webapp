
export const msalConfig = {
  auth: {
    clientId: '827656f8-3a21-4d69-b6e5-c35e2ec2fb71',
    authority: 'https://login.microsoftonline.com/97d84781-b85c-4034-a0d0-588e7b442e45',
    redirectUri: 'https://abirrahat.github.io/wolcas-webapp/auth',
    navigateToLoginRequestUrl: false
  },
  cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false },
  system: { loggerOptions: { loggerCallback: () => {} } }
};

export const loginRequest = { scopes: ['User.Read', 'Sites.ReadWrite.All', 'Files.ReadWrite.All'] };
export const msalInstance = new msal.PublicClientApplication(msalConfig);

export async function ensureSignedIn() {
  await msalInstance.initialize();
  const accts = msalInstance.getAllAccounts();
  if (accts.length) { msalInstance.setActiveAccount(accts[0]); return accts[0]; }
  return null;
}
export async function login() { const resp = await msalInstance.loginPopup(loginRequest); msalInstance.setActiveAccount(resp.account); return resp.account; }
export async function logout() { await msalInstance.logoutPopup({ mainWindowRedirectUri: 'https://abirrahat.github.io/wolcas-webapp/' }); }
export function getRole() { const acct = msalInstance.getActiveAccount(); const roles = (acct?.idTokenClaims?.roles || []).map(r => r.toLowerCase()); if (roles.includes('admin')) return 'admin'; if (roles.includes('editor')) return 'editor'; return 'viewer'; }
