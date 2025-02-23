PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_partite` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`squadra_casa` integer,
	`punti_squadra_casa` integer DEFAULT 0 NOT NULL,
	`squadra_ospite` integer,
	`punti_squadra_ospite` integer DEFAULT 0 NOT NULL,
	`giornata_id` integer,
	FOREIGN KEY (`squadra_casa`) REFERENCES `squadre`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`squadra_ospite`) REFERENCES `squadre`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`giornata_id`) REFERENCES `giornate`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_partite`("id", "squadra_casa", "punti_squadra_casa", "squadra_ospite", "punti_squadra_ospite", "giornata_id") SELECT "id", "squadra_casa", "punti_squadra_casa", "squadra_ospite", "punti_squadra_ospite", "giornata_id" FROM `partite`;--> statement-breakpoint
DROP TABLE `partite`;--> statement-breakpoint
ALTER TABLE `__new_partite` RENAME TO `partite`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_squadre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` integer,
	`lega_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_squadre`("id", "nome", "created_at", "user_id", "lega_id") SELECT "id", "nome", "created_at", "user_id", "lega_id" FROM `squadre`;--> statement-breakpoint
DROP TABLE `squadre`;--> statement-breakpoint
ALTER TABLE `__new_squadre` RENAME TO `squadre`;