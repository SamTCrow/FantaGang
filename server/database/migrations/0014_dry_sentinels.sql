DROP TABLE `giornate`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_partite` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`squadra_casa` integer,
	`punti_squadra_casa` integer DEFAULT 0 NOT NULL,
	`squadra_ospite` integer,
	`punti_squadra_ospite` integer DEFAULT 0 NOT NULL,
	`lega_id` integer,
	`numero_giornata` integer NOT NULL,
	FOREIGN KEY (`squadra_casa`) REFERENCES `squadre`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`squadra_ospite`) REFERENCES `squadre`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_partite`("id", "squadra_casa", "punti_squadra_casa", "squadra_ospite", "punti_squadra_ospite", "lega_id", "numero_giornata") SELECT "id", "squadra_casa", "punti_squadra_casa", "squadra_ospite", "punti_squadra_ospite", "lega_id", "numero_giornata" FROM `partite`;--> statement-breakpoint
DROP TABLE `partite`;--> statement-breakpoint
ALTER TABLE `__new_partite` RENAME TO `partite`;--> statement-breakpoint
PRAGMA foreign_keys=ON;