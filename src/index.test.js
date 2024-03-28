const { unstable_dev } = require("wrangler");

describe("Worker", () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev("src/index.js", {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should return mta-sts policy", async () => {
		const resp = await worker.fetch('https://mta-sts.richardgrime.com/.well-known/mta-sts.txt');
		if (resp) {
			const text = await resp.text();
			expect(text).toMatchInlineSnapshot(`
"version: STSv1
mode: enforce
mx: alt2.aspmx.l.google.com
mx: alt3.aspmx.l.google.com
mx: alt1.aspmx.l.google.com
mx: aspmx.l.google.com
mx: alt4.aspmx.l.google.com
max_age: 1209600
"
`);
		}
	});
});
