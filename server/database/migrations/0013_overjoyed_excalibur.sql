PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_squadre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`presidente` text DEFAULT 'Ignoto' NOT NULL,
	`stemma` text,
	`created_at` integer NOT NULL,
	`user_id` integer,
	`lega_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_squadre`("id", "nome", "presidente", "stemma", "created_at", "user_id", "lega_id") SELECT "id", "nome", "presidente", "stemma", "created_at", "user_id", "lega_id" FROM `squadre`;--> statement-breakpoint
DROP TABLE `squadre`;--> statement-breakpoint
ALTER TABLE `__new_squadre` RENAME TO `squadre`;--> statement-breakpoint
PRAGMA foreign_keys=ON;