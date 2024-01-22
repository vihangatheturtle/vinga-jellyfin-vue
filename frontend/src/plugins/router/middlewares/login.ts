import type {
  RouteLocationNormalized,
  RouteLocationPathRaw,
  RouteLocationRaw
} from 'vue-router/auto';
import { remote } from '@/plugins/remote';
import { isNil } from '@/utils/validation';

const serverAddUrl = '/server/add';
const serverSelectUrl = '/server/select';
const serverLoginUrl = '/server/login';
const routes = new Set([serverAddUrl, serverSelectUrl, serverLoginUrl]);

/**
 * Redirects to login page if there's no user logged in.
 */
export async function loginGuard(
  to: RouteLocationNormalized
): Promise<boolean | RouteLocationRaw> {
  let destinationRoute: RouteLocationPathRaw | undefined;

  if (remote.auth.servers.length <= 0) {
    await remote.auth.connectServer("https://jellyfin.filmclick.eu.org");

    // await (emote.auth.servers.length === 0
    //   ? destinationRoute = { path: serverLoginUrl, replace: true }
    //   : destinationRoute = { path: serverLoginUrl, replace: true };);
    
    destinationRoute = { path: serverLoginUrl, replace: true };
  } else if (!routes.has(to.path)) {
    if (isNil(remote.auth.currentServer)) {
      destinationRoute = { path: serverSelectUrl, replace: true };
    } else if (isNil(remote.auth.currentUser)) {
      destinationRoute = { path: serverLoginUrl, replace: true };
    }
  }

  return destinationRoute && to.path !== destinationRoute.path
    ? destinationRoute
    : true;
}
