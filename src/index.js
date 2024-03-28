const stsPolicies = {
"mta-sts.richardgrime.com":
`version: STSv1
mode: enforce
mx: alt2.aspmx.l.google.com
mx: alt3.aspmx.l.google.com
mx: alt1.aspmx.l.google.com
mx: aspmx.l.google.com
mx: alt4.aspmx.l.google.com
max_age: 1209600`,
"mta-sts.grime.family":
`version: STSv1
mode: enforce
mx: alt2.aspmx.l.google.com
mx: alt3.aspmx.l.google.com
mx: alt1.aspmx.l.google.com
mx: aspmx.l.google.com
mx: alt4.aspmx.l.google.com
max_age: 1209600`
}
  
const respHeaders = {
	"Content-Type": "text/plain;charset=UTF-8",
}

addEventListener("fetch", event => {
	event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
let reqUrl = new URL(request.url)

if (!stsPolicies.hasOwnProperty(reqUrl.hostname)) {
	return new Response(`${reqUrl.hostname} is not defined in the mta-sts worker\n`, {status: 500, headers: respHeaders})
}

if (reqUrl.protocol === "https:" && reqUrl.pathname === "/.well-known/mta-sts.txt") {
	return new Response(stsPolicies[reqUrl.hostname] + "\n", {status: 200, headers: respHeaders})
} else {
	reqUrl.protocol = "https:"
	reqUrl.pathname = "/.well-known/mta-sts.txt"
	return Response.redirect(reqUrl, 301)
}
}
