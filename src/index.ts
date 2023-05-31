import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";

type ErrorType = Error & { status: number };

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000/",
  })
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT ?? 3000;

app.use("/auth", authRouter);
app.use(userRouter);

app.use((_req, _res, next) => {
  next(new createError.NotFound("This route does not exist"));
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
