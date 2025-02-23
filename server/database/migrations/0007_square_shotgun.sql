CREATE TABLE `partecipantiLeghe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lega_id` integer,
	`squadra_id` integer,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`squadra_id`) REFERENCES `squadre`(`id`) ON UPDATE no action ON DELETE cascade
);
