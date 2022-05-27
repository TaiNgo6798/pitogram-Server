/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum PERMISSIONS {
	ACCESS = 'ACCESS',
	POST = 'POST',
	DELETE = 'DELETE',
	EDIT = 'EDIT',
	POSTCOMMENT = 'POSTCOMMENT',
	EDITCOMMENT = 'EDITCOMMENT',
	DELETECOMMENT = 'DELETECOMMENT',
	ADMIN = 'ADMIN'
}

export enum REACT {
	LIKE = 'LIKE',
	LOVE = 'LOVE',
	HAHA = 'HAHA',
	WOW = 'WOW',
	SAD = 'SAD',
	ANGRY = 'ANGRY'
}

export class ChatInput {
	receiveID: string
	text: string
}

export class CommentInput {
	postID: string
	text: string
	parentID: string
}

export class DeleteInput {
	postID: string
}

export class EditInput {
	_id: string
	text: string
}

export class GetChatInput {
	receiveID: string
	skip: number
}

export class LikeInput {
	parentID: string
	react: REACT
}

export class NotiInput {
	userID?: string
	postID?: string
	thumb?: string
	text?: string
	whoInteractive?: string
	timeStamp?: number
	seen?: boolean
}

export class PhotoInput {
	postID?: string
	pathID?: string
	height?: number
	width?: number
	focalLength?: number
	iso?: number
	artist?: string
	copyright?: string
	flash?: string
	lensModel?: string
	make?: string
	model?: string
	createDate?: string
}

export class PostEditInput {
	_id: string
	description?: string
	tags?: string
}

export class PostInput {
	description?: string
	photo: PhotoInput
	tags?: string[]
}

export class ReactChatInput {
	chatID: string
	react: REACT
}

export class TypingChatInput {
	receiveID: string
	status: boolean
}

export class TypingInput {
	postID: string
	status: boolean
}

export class UserInfoInput {
	firstName?: string
	lastName?: string
	avatar?: string
	coverPhoto?: string
	bio?: string
	dob?: string
	gender?: string
	relationship?: string
	phone?: string
	schools?: string[]
	companies?: string[]
	interestList?: string[]
}

export class UserInput {
	email: string
	password: string
	firstName: string
	lastName: string
	gender: string
}

export class UserLoginInput {
	email?: string
	password?: string
}

export class Chat {
	_id?: string
	text?: string
	sendID?: string
	receiveID?: string
	secretString?: string
	reactions?: ChatReaction[]
	time?: number
	seen?: boolean
}

export class ChatReaction {
	idWho?: string
	react?: REACT
}

export class Comment {
	_id?: string
	who?: User
	userID?: string
	postID?: string
	text?: string
	time?: number
	likes?: Like[]
	parentID?: string
}

export class LastSeenData {
	_id?: string
	oldLastSeen?: number
	lastSeen?: number
}

export class Like {
	_id?: string
	who?: User
	parentID?: string
	idWho?: string
	react?: REACT
}

export class LoginRes {
	status?: string
	message?: string
	token?: string
}

export abstract class IMutation {
	abstract sendChat(input: ChatInput): boolean | Promise<boolean>

	abstract reactToAChat(input: ReactChatInput): boolean | Promise<boolean>

	abstract submitChatStatus(input: TypingChatInput): boolean | Promise<boolean>

	abstract iReadMyChatWith(_id: string): boolean | Promise<boolean>

	abstract postOneComment(
		commentInput: CommentInput
	): boolean | Promise<boolean>

	abstract editOneComment(editInput: EditInput): boolean | Promise<boolean>

	abstract deleteOneComment(_id: string): boolean | Promise<boolean>

	abstract submitCommentStatus(input: TypingInput): boolean | Promise<boolean>

	abstract doLike(likeInput: LikeInput): boolean | Promise<boolean>

	abstract unLike(parentID: string): boolean | Promise<boolean>

	abstract createNotification(
		notiInput: NotiInput
	): Notification | Promise<Notification>

	abstract deleteNotification(_id: string): boolean | Promise<boolean>

	abstract deleteAllNotification(): boolean | Promise<boolean>

	abstract iReadMyNoti(_id: string): boolean | Promise<boolean>

	abstract addPhoto(PhotoInput: PhotoInput): Photo | Promise<Photo>

	abstract deletePhotoByPostID(
		postID: string,
		pathID: string
	): boolean | Promise<boolean>

	abstract addPost(post: PostInput): Post | Promise<Post>

	abstract deletePost(deleteInput: DeleteInput): boolean | Promise<boolean>

	abstract updatePost(post: PostEditInput): boolean | Promise<boolean>

	abstract updateUserInfo(userInfo: UserInfoInput): boolean | Promise<boolean>

	abstract imOnline(): boolean | Promise<boolean>

	abstract createTags(tags?: string[]): boolean | Promise<boolean>

	abstract deleteTag(_id: string): boolean | Promise<boolean>

	abstract createUser(user?: UserInput): boolean | Promise<boolean>

	abstract login(loginInput?: UserLoginInput): LoginRes | Promise<LoginRes>

	abstract resetPassword(email: string): boolean | Promise<boolean>

	abstract updateUser(
		_id: string,
		interest: string[]
	): boolean | Promise<boolean>
}

export class Notification {
	_id?: string
	userID?: string
	postID?: string
	thumb?: string
	text?: string
	whoInteractive?: string
	timeStamp?: number
	seen?: boolean
}

export class Photo {
	_id?: string
	postID?: string
	pathID?: string
	height?: number
	width?: number
	focalLength?: number
	iso?: number
	artist?: string
	copyright?: string
	flash?: string
	lensModel?: string
	make?: string
	model?: string
	createDate?: string
}

export class Post {
	_id?: string
	idWho?: string
	who?: User
	photo?: Photo
	description?: string
	likes?: Like[]
	time?: number
	commentsCount?: number
	tags?: string[]
}

export class PostByMonth {
	month?: number
	count?: number
}

export abstract class IQuery {
	abstract getChats(input: GetChatInput): Chat[] | Promise<Chat[]>

	abstract getMyUnReadMessages(): UnreadMessage[] | Promise<UnreadMessage[]>

	abstract getCommentsByPostID(
		postID: string,
		parentID: string,
		limit?: number,
		skip?: number
	): Comment[] | Promise<Comment[]>

	abstract getCommentsByPostID1(
		postID: string,
		limit?: number,
		skip?: number
	): Comment[] | Promise<Comment[]>

	abstract getCommentsByParentID(
		parentID: string,
		limit?: number,
		skip?: number
	): Comment[] | Promise<Comment[]>

	abstract countCommentByPostID(postID: string): number | Promise<number>

	abstract getLikesByPostID(parentID: string): Like[] | Promise<Like[]>

	abstract getNotiByUserID(
		userID: string
	): Notification[] | Promise<Notification[]>

	abstract getAllNoti(): Notification[] | Promise<Notification[]>

	abstract getPhotoByPostID(postID: string): Photo | Promise<Photo>

	abstract posts(skip: number, limit?: number): Post[] | Promise<Post[]>

	abstract getOnePost(_id: string): Post | Promise<Post>

	abstract getPostsByUserID(
		userID: string,
		skip: number
	): Post[] | Promise<Post[]>

	abstract getImagesByUserID(userID: string): Post[] | Promise<Post[]>

	abstract search(
		keywords?: string[],
		skip?: number,
		limit?: number
	): Post[] | Promise<Post[]>

	abstract countPostByMonths(
		months?: number[]
	): PostByMonth[] | Promise<PostByMonth[]>

	abstract tags(): Tag[] | Promise<Tag[]>

	abstract users(): User[] | Promise<User[]>

	abstract getUserByID(_id?: string): User | Promise<User>
}

export abstract class ISubscription {
	abstract newChatSentToMe(): Chat | Promise<Chat>

	abstract newChatSentToConversation(receiveID: string): Chat | Promise<Chat>

	abstract chatTyping(receiveID: string): TypingChat | Promise<TypingChat>

	abstract commentCreated(postID: string): Comment | Promise<Comment>

	abstract commentTyping(postID: string): Typing | Promise<Typing>

	abstract notiAdded(): Notification | Promise<Notification>

	abstract someOneJustOnline(): LastSeenData | Promise<LastSeenData>
}

export class Tag {
	_id?: string
	tagName?: string
}

export class Typing {
	postID?: string
	status?: boolean
}

export class TypingChat {
	sendID?: string
	receiveID?: string
	status?: boolean
}

export class UnreadMessage {
	sendID?: string
}

export class User {
	_id?: string
	email?: string
	password?: string
	firstName?: string
	lastName?: string
	avatar?: string
	coverPhoto?: string
	bio?: string
	relationship?: string
	dob?: string
	gender?: string
	phone?: string
	schools?: string[]
	companies?: string[]
	permissions?: PERMISSIONS[]
	lastSeen?: number
	unReadFrom?: UnreadMessage[]
	followingPostIDs?: string[]
	interestList?: string[]
}
