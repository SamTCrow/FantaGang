PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_leghe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_by` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_leghe`("id", "name", "created_by", "created_at") SELECT "id", "name", "created_by", "created_at" FROM `leghe`;--> statement-breakpoint
DROP TABLE `leghe`;--> statement-breakpoint
ALTER TABLE `__new_leghe` RENAME TO `leghe`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_squadre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` integer,
	`lega_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_squadre`("id", "nome", "created_at", "user_id", "lega_id") SELECT "id", "nome", "created_at", "user_id", "lega_id" FROM `squadre`;--> statement-breakpoint
DROP TABLE `squadre`;--> statement-breakpoint
ALTER TABLE `__new_squadre` RENAME TO `squadre`;