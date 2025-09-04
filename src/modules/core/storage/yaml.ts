import { parse, stringify } from 'yaml'

export const loadYaml = <T>(text: string): T => parse(text) as T
export const saveYaml = (data: unknown): string => stringify(data)
