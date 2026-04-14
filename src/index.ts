import { Hono } from "hono";
import * as z from "zod";

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(16),
});

type LoginRequest = z.infer<typeof loginSchema>;

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.post("/login", async (c) => {
	try {
		const payload = await c.req.json();
		const validated = loginSchema.safeParse(payload);

		if (!validated.success) {
			return c.json({ error: "Invalid Request Body" }, 400);
		}

		const { email, password } = validated.data as LoginRequest;

		return c.json({
			message: "Login Successful",
			email: email,
			password: password,
		});
	} catch (error) {
		return c.json({ error: "Invalid Request Body" }, 400);
	}
});

export default {
	port: 80,
	fetch: app.fetch,
};
