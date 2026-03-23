import { Worker } from "bullmq";
import { redisConnection } from "../lib/redis.js";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";

// Set up nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // My Gmail address
    pass: process.env.EMAIL_PASS, // The Google App Password
  },
});

const worker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, template, context } = job.data;
    console.log(`Processing email to: ${to}`);
    // Define _dirname for ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Load template file
    const templatePath = path.join(__dirname, `../templates/${template}.hbs`);
    const source = fs.readFileSync(templatePath, "utf-8");

    // Compile and inject data
    const compiledTemplate = Handlebars.compile(source);
    const htmlToSend = compiledTemplate(context);

    // Send via Nodemailer
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlToSend,
    });

    console.log(`Email sent for job ${job.id}`);
  },
  { connection: redisConnection as any },
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed!`));
worker.on("failed", (job, err) =>
  console.error(`Job ${job?.id} failed: ${err.message}`),
);
