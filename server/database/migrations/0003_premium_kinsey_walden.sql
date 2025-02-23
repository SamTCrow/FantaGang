PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_giornate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numero` integer NOT NULL,
	`lega_id` integer,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_giornate`("id", "numero", "lega_id") SELECT "id", "numero", "lega_id" FROM `giornate`;--> statement-breakpoint
DROP TABLE `giornate`;--> statement-breakpoint
ALTER TABLE `__new_giornate` RENAME TO `giornate`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
