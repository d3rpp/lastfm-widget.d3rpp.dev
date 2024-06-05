import z from 'zod';

export const ParametersSchema = z.object({
	/**
	 * api key used to contact last.fm
	 * 
	 * should be a 32-character 
	 */
	api_key: z.string().regex(/^[a-f0-9]{32}$/),
	/**
	 * 
	 */
	update_interval: z.number().min(1).max(10)
});

export type Parameters = z.infer<typeof ParametersSchema>