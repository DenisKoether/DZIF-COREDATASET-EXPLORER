
//import { buildLibrary, buildMeasure } from './cql-measure';
import { env } from '$env/dynamic/public';
import { clearSiteResults, getAst, setSiteResult, showToast, type LensResult } from '@samply/lens';

let abortController = new AbortController();


export const requestBackend = async (

) => {

  abortController.abort();
    abortController = new AbortController();
    clearSiteResults();

	let backendUrl: string | undefined;

	backendUrl = env.PUBLIC_BACKEND_URL;
	if (backendUrl === undefined) {
		backendUrl = "http://localhost:3001"
	}

        try {
	    const response = await fetch(`${backendUrl}/exec`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(getAst()),
        redirect: "manual", // Used to detect redirects
    });

	setSiteResult("dzif", await response.json())
} catch (error) {
          showToast("There was an error while quering", "error");

}
};
