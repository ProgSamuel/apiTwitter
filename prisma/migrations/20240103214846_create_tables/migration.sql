-- CreateTable
CREATE TABLE "user" (
    "id_user" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password" VARCHAR(30) NOT NULL,
    "token" VARCHAR(50),
    "dt_hr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_hr_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "likes" (
    "idUser" UUID NOT NULL,
    "twitterId" UUID,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "reply" (
    "id_reply" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "twitterId" UUID,
    "reply_content" VARCHAR(144) NOT NULL,
    "dt_hr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_hr_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reply_pkey" PRIMARY KEY ("id_reply")
);

-- CreateTable
CREATE TABLE "twitter" (
    "id_twitter" UUID NOT NULL,
    "content" VARCHAR(144) NOT NULL,
    "type" TEXT NOT NULL,
    "dt_hr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_hr_updated" TIMESTAMP(3) NOT NULL,
    "idUser" UUID NOT NULL,

    CONSTRAINT "twitter_pkey" PRIMARY KEY ("id_twitter")
);

-- CreateTable
CREATE TABLE "followers" (
    "idUser" UUID NOT NULL,
    "dt_hr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_hr_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("idUser")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_twitterId_fkey" FOREIGN KEY ("twitterId") REFERENCES "twitter"("id_twitter") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_twitterId_fkey" FOREIGN KEY ("twitterId") REFERENCES "twitter"("id_twitter") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twitter" ADD CONSTRAINT "twitter_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
