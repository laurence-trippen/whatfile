import type { PathLike } from "node:fs"

export const PDF_STANDARD_HEADER: string                                                                                                                                                                                                       
export const PDF_PASSWORD_BYTE_INDICATOR: Buffer                                                                                                                                                                                               

export function isPdf(path: PathLike): Promise<boolean>                                                                                                                                                                                          
export function hasPdfPassword(path: PathLike): Promise<boolean>
