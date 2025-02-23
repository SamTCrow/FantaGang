PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_leghe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_by` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_leghe`("id", "name", "created_by", "created_at") SELECT "id", "name", "created_by", "created_at" FROM `leghe`;--> statement-breakpoint
DROP TABLE `leghe`;--> statement-breakpoint
ALTER TABLE `__new_leghe` RENAME TO `leghe`;--> statement-breakpoint
PRAGMA foreign_keys=ON;