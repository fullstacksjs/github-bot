CREATE TABLE `contributors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gh_username` text NOT NULL,
	`tg_id` integer,
	`tg_name` text,
	`tg_username` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contributors_ghUsername_unique` ON `contributors` (`gh_username`);--> statement-breakpoint
CREATE INDEX `idx_contributors_gh` ON `contributors` (`gh_username`);--> statement-breakpoint
CREATE TABLE `repositories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`html_url` text NOT NULL,
	`is_blacklisted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `repositories_name_unique` ON `repositories` (`name`);--> statement-breakpoint
CREATE INDEX `idx_repository_name` ON `repositories` (`name`);--> statement-breakpoint
CREATE TABLE `repository_contributors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`repository_id` integer NOT NULL,
	`contributor_id` integer NOT NULL,
	`contributions` integer,
	FOREIGN KEY (`repository_id`) REFERENCES `repositories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contributor_id`) REFERENCES `contributors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_unique_repo_contributor` ON `repository_contributors` (`repository_id`,`contributor_id`);