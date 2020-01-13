declare var require: {
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (
		paths: string[],
		callback: (require: <T>(path: string) => T) => void
	) => void;
};
declare var module: any

declare module '*.gif'
declare module '*.ico'
declare module '*.cur'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.webp'
declare module '*.png'
declare module '*.svg'
declare module '*.scss'
declare module '*.less'
declare module '*.md'
declare module '*.MD'
declare module '*.mp4'
declare module '*.webm'
declare module '*.ogg'
declare module '*.mp3'
declare module '*.wav'
declare module '*.flac'
declare module '*.aac'
declare var ConfigExt: object 

/**
 * @desc 发现该文件中不能使用 import 语句，否则会失效
 *
 * @interface MyGlobalStatic
 * @extends {GlobalStatic}
 */
declare interface MyGlobalStatic extends GlobalStatic {
	map: any,
	viewConfig: any
}
declare const global: MyGlobalStatic;

