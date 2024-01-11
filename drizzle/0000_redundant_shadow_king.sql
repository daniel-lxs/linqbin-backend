CREATE TABLE `entries` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text,
	`content` text NOT NULL,
	`ttl` integer NOT NULL,
	`visitCountThreshold` integer NOT NULL,
	`createdOn` integer NOT NULL,
	`expiresOn` integer NOT NULL,
	`deletedOn` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entries_slug_unique` ON `entries` (`slug`);