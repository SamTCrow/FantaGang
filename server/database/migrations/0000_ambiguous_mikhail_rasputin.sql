CREATE TABLE `giornate` (
	`id` integer NOT NULL,
	`lega_id` integer,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `leghe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `partite` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`squadra_casa` integer,
	`punti_squadra_casa` integer DEFAULT 0 NOT NULL,
	`squadra_ospite` integer,
	`punti_squadra_ospite` integer DEFAULT 0 NOT NULL,
	`lega_id` integer,
	FOREIGN KEY (`squadra_casa`) REFERENCES `squadre`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`squadra_ospite`) REFERENCES `squadre`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `squadre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`created_at` integer NOT NULL,
	`propretario` text DEFAULT 'Ignoto' NOT NULL,
	`lega_id` integer,
	FOREIGN KEY (`lega_id`) REFERENCES `leghe`(`id`) ON UPDATE no action ON DELETE cascade
);
