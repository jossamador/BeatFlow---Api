-- CreateTable
CREATE TABLE `playlists` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlist_tracks` (
    `id` VARCHAR(191) NOT NULL,
    `playlistId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `mbid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `playlists` ADD CONSTRAINT `playlists_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_tracks` ADD CONSTRAINT `playlist_tracks_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `playlists`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
