export interface Session {
	PlayState: PlayState;
	AdditionalUsers: AdditionalUser[];
	Capabilities: Capabilities;
	RemoteEndPoint: string;
	PlayableMediaTypes: string[];
	Id: string;
	UserId: string;
	UserName: string;
	Client: string;
	LastActivityDate: string;
	LastPlaybackCheckIn: string;
	LastPausedDate: string;
	DeviceName: string;
	DeviceType: string;
	NowPlayingItem?: NowPlayingItem;
	NowViewingItem: NowViewingItem;
	DeviceId: string;
	ApplicationVersion: string;
	TranscodingInfo?: TranscodingInfo;
	IsActive: boolean;
	SupportsMediaControl: boolean;
	SupportsRemoteControl: boolean;
	NowPlayingQueue: NowPlayingQueue[];
	NowPlayingQueueFullItems: NowPlayingQueueFullItem[];
	HasCustomDeviceName: boolean;
	PlaylistItemId: string;
	ServerId: string;
	UserPrimaryImageTag: string;
	SupportedCommands: string[];
}

interface PlayState {
	PositionTicks: number;
	CanSeek: boolean;
	IsPaused: boolean;
	IsMuted: boolean;
	VolumeLevel: number;
	AudioStreamIndex: number;
	SubtitleStreamIndex: number;
	MediaSourceId: string;
	PlayMethod: string;
	RepeatMode: string;
	PlaybackOrder: string;
	LiveStreamId: string;
}

interface AdditionalUser {
	UserId: string;
	UserName: string;
}

interface Capabilities {
	PlayableMediaTypes: string[];
	SupportedCommands: string[];
	SupportsMediaControl: boolean;
	SupportsPersistentIdentifier: boolean;
	DeviceProfile: DeviceProfile;
	AppStoreUrl: string;
	IconUrl: string;
}

interface DeviceProfile {
	Name: string;
	Id: string;
	MaxStreamingBitrate: number;
	MaxStaticBitrate: number;
	MusicStreamingTranscodingBitrate: number;
	MaxStaticMusicBitrate: number;
	DirectPlayProfiles: DirectPlayProfile[];
	TranscodingProfiles: TranscodingProfile[];
	ContainerProfiles: ContainerProfile[];
	CodecProfiles: CodecProfile[];
	SubtitleProfiles: SubtitleProfile[];
}

interface DirectPlayProfile {
	Container: string;
	AudioCodec: string;
	VideoCodec: string;
	Type: string;
}

interface TranscodingProfile {
	Container: string;
	Type: string;
	VideoCodec: string;
	AudioCodec: string;
	Protocol: string;
	EstimateContentLength: boolean;
	EnableMpegtsM2TsMode: boolean;
	TranscodeSeekInfo: string;
	CopyTimestamps: boolean;
	Context: string;
	EnableSubtitlesInManifest: boolean;
	MaxAudioChannels: string;
	MinSegments: number;
	SegmentLength: number;
	BreakOnNonKeyFrames: boolean;
	Conditions: Condition[];
}

interface Condition {
	Condition: string;
	Property: string;
	Value: string;
	IsRequired: boolean;
}

interface ContainerProfile {
	Type: string;
	Conditions: Condition[];
	Container: string;
}

interface CodecProfile {
	Type: string;
	Conditions: Condition[];
	ApplyConditions: Condition[];
	Codec: string;
	Container: string;
}

interface SubtitleProfile {
	Format: string;
	Method: string;
	DidlMode: string;
	Language: string;
	Container: string;
}

interface NowPlayingItem {
	Name: string;
	OriginalTitle: string;
	ServerId: string;
	Id: string;
	Etag: string;
	SourceType: string;
	PlaylistItemId: string;
	DateCreated: string;
	DateLastMediaAdded: string;
	ExtraType: string;
	AirsBeforeSeasonNumber: number;
	AirsAfterSeasonNumber: number;
	AirsBeforeEpisodeNumber: number;
	CanDelete: boolean;
	CanDownload: boolean;
	HasLyrics: boolean;
	HasSubtitles: boolean;
	PreferredMetadataLanguage: string;
	PreferredMetadataCountryCode: string;
	Container: string;
	SortName: string;
	ForcedSortName: string;
	Video3DFormat: string;
	PremiereDate: string;
	ExternalUrls: ExternalUrl[];
	MediaSources: MediaSource[];
	CriticRating: number;
	ProductionLocations: string[];
	Path: string;
	EnableMediaSourceDisplay: boolean;
	OfficialRating: string;
	CustomRating: string;
	ChannelId: string;
	ChannelName: string;
	Overview: string;
	Taglines: string[];
	Genres: string[];
	CommunityRating: number;
	CumulativeRunTimeTicks: number;
	RunTimeTicks: number;
	PlayAccess: string;
	AspectRatio: string;
	ProductionYear: number;
	IsPlaceHolder: boolean;
	Number: string;
	ChannelNumber: string;
	IndexNumber: number;
	IndexNumberEnd: number;
	ParentIndexNumber: number;
	RemoteTrailers: RemoteTrailer[];
	ProviderIds: AdditionalProps;
	IsHD: boolean;
	IsFolder: boolean;
	ParentId: string;
	Type: string;
	People: Person[];
	Studios: Studio[];
	GenreItems: GenreItem[];
	ParentLogoItemId: string;
	ParentBackdropItemId: string;
	ParentBackdropImageTags: string[];
	LocalTrailerCount: number;
	UserData: UserData;
	RecursiveItemCount: number;
	ChildCount: number;
	SeriesName: string;
	SeriesId: string;
	SeasonId: string;
	SpecialFeatureCount: number;
	DisplayPreferencesId: string;
	Status: string;
	AirTime: string;
	AirDays: string[];
	Tags: string[];
	PrimaryImageAspectRatio: number;
	Artists: string[];
	ArtistItems: ArtistItem[];
	Album: string;
	CollectionType: string;
	DisplayOrder: string;
	AlbumId: string;
	AlbumPrimaryImageTag: string;
	SeriesPrimaryImageTag: string;
	AlbumArtist: string;
	AlbumArtists: AlbumArtist[];
	SeasonName: string;
	MediaStreams: MediaStream[];
	VideoType: string;
	PartCount: number;
	MediaSourceCount: number;
	ImageTags: AdditionalProps;
	BackdropImageTags: string[];
	ScreenshotImageTags: string[];
	ParentLogoImageTag: string;
	ParentArtItemId: string;
	ParentArtImageTag: string;
	SeriesThumbImageTag: string;
	ImageBlurHashes: ImageBlurHashes;
	SeriesStudio: string;
	ParentThumbItemId: string;
	ParentThumbImageTag: string;
	ParentPrimaryImageItemId: string;
	ParentPrimaryImageTag: string;
	Chapters: Chapter[];
	Trickplay: Trickplay;
	LocationType: string;
	IsoType: string;
	MediaType: string;
	EndDate: string;
	LockedFields: string[];
	TrailerCount: number;
	MovieCount: number;
	SeriesCount: number;
	ProgramCount: number;
	EpisodeCount: number;
	SongCount: number;
	AlbumCount: number;
	ArtistCount: number;
	MusicVideoCount: number;
	LockData: boolean;
	Width: number;
	Height: number;
	CameraMake: string;
	CameraModel: string;
	Software: string;
	ExposureTime: number;
	FocalLength: number;
	ImageOrientation: string;
	Aperture: number;
	ShutterSpeed: number;
	Latitude: number;
	Longitude: number;
	Altitude: number;
	IsoSpeedRating: number;
	SeriesTimerId: string;
	ProgramId: string;
	ChannelPrimaryImageTag: string;
	StartDate: string;
	CompletionPercentage: number;
	IsRepeat: boolean;
	EpisodeTitle: string;
	ChannelType: string;
	Audio: string;
	IsMovie: boolean;
	IsSports: boolean;
	IsSeries: boolean;
	IsLive: boolean;
	IsNews: boolean;
	IsKids: boolean;
	IsPremiere: boolean;
	TimerId: string;
	NormalizationGain: number;
	CurrentProgram: string;
}

interface ExternalUrl {
	Name: string;
	Url: string;
}

interface MediaSource {
	Protocol: string;
	Id: string;
	Path: string;
	EncoderPath: string;
	EncoderProtocol: string;
	Type: string;
	Container: string;
	Size: number;
	Name: string;
	IsRemote: boolean;
	ETag: string;
	RunTimeTicks: number;
	ReadAtNativeFramerate: boolean;
	IgnoreDts: boolean;
	IgnoreIndex: boolean;
	GenPtsInput: boolean;
	SupportsTranscoding: boolean;
	SupportsDirectStream: boolean;
	SupportsDirectPlay: boolean;
	IsInfiniteStream: boolean;
	RequiresOpening: boolean;
	OpenToken: string;
	RequiresClosing: boolean;
	LiveStreamId: string;
	BufferMs: number;
	RequiresLooping: boolean;
	SupportsProbing: boolean;
	VideoType: string;
	IsoType: string;
	Video3DFormat: string;
	MediaStreams: MediaStream[];
	MediaAttachments: MediaAttachment[];
	Formats: string[];
	Bitrate: number;
	Timestamp: string;
	RequiredHttpHeaders: AdditionalProps;
	TranscodingUrl: string;
	TranscodingSubProtocol: string;
	TranscodingContainer: string;
	AnalyzeDurationMs: number;
	DefaultAudioStreamIndex: number;
	DefaultSubtitleStreamIndex: number;
}

interface MediaStream {
	Codec: string;
	CodecTag: string;
	Language: string;
	ColorRange: string;
	ColorSpace: string;
	ColorTransfer: string;
	ColorPrimaries: string;
	DvVersionMajor: number;
	DvVersionMinor: number;
	DvProfile: number;
	DvLevel: number;
	RpuPresentFlag: number;
	ElPresentFlag: number;
	BlPresentFlag: number;
	DvBlSignalCompatibilityId: number;
	Comment: string;
	TimeBase: string;
	CodecTimeBase: string;
	Title: string;
	VideoRange: string;
	VideoRangeType: string;
	VideoDoViTitle: string;
	AudioSpatialFormat: string;
	LocalizedUndefined: string;
	LocalizedDefault: string;
	LocalizedForced: string;
	LocalizedExternal: string;
	LocalizedHearingImpaired: string;
	DisplayTitle: string;
	NalLengthSize: string;
	IsInterlaced: boolean;
	IsAVC: boolean;
	ChannelLayout: string;
	BitRate: number;
	BitDepth: number;
	RefFrames: number;
	PacketLength: number;
	Channels: number;
	SampleRate: number;
	IsDefault: boolean;
	IsForced: boolean;
	IsHearingImpaired: boolean;
	Height: number;
	Width: number;
	AverageFrameRate: number;
	RealFrameRate: number;
	Profile: string;
	Type: string;
	AspectRatio: string;
	Index: number;
	Score: number;
	IsExternal: boolean;
	DeliveryMethod: string;
	DeliveryUrl: string;
	IsExternalUrl: boolean;
	IsTextSubtitleStream: boolean;
	SupportsExternalStream: boolean;
	Path: string;
	PixelFormat: string;
	Level: number;
	IsAnamorphic: boolean;
}

interface MediaAttachment {
	Codec: string;
	CodecTag: string;
	Comment: string;
	Index: number;
	FileName: string;
	MimeType: string;
	DeliveryUrl: string;
}

type AdditionalProps = Record<string, string>;

interface RemoteTrailer {
	Url: string;
	Name: string;
}

interface Person {
	Name: string;
	Id: string;
	Role: string;
	Type: string;
	PrimaryImageTag: string;
	ImageBlurHashes: ImageBlurHashes;
}

interface ImageBlurHashes {
	Primary: AdditionalProps;
	Art: AdditionalProps;
	Backdrop: AdditionalProps;
	Banner: AdditionalProps;
	Logo: AdditionalProps;
	Thumb: AdditionalProps;
	Disc: AdditionalProps;
	Box: AdditionalProps;
	Screenshot: AdditionalProps;
	Menu: AdditionalProps;
	Chapter: AdditionalProps;
	BoxRear: AdditionalProps;
	Profile: AdditionalProps;
}

interface Studio {
	Name: string;
	Id: string;
}

interface GenreItem {
	Name: string;
	Id: string;
}

interface UserData {
	Rating: number;
	PlayedPercentage: number;
	UnplayedItemCount: number;
	PlaybackPositionTicks: number;
	PlayCount: number;
	IsFavorite: boolean;
	Likes: boolean;
	LastPlayedDate: string;
	Played: boolean;
	Key: string;
	ItemId: string;
}

interface ArtistItem {
	Name: string;
	Id: string;
}

interface AlbumArtist {
	Name: string;
	Id: string;
}

interface Chapter {
	StartPositionTicks: number;
	Name: string;
	ImagePath: string;
	ImageDateModified: string;
	ImageTag: string;
}

type Trickplay = Record<string, Record<string, TrickplayItem>>;

interface TrickplayItem {
	Width: number;
	Height: number;
	TileWidth: number;
	TileHeight: number;
	ThumbnailCount: number;
	Interval: number;
	Bandwidth: number;
}

interface NowViewingItem {
	Name: string;
	OriginalTitle: string;
	ServerId: string;
	Id: string;
	Etag: string;
	SourceType: string;
	PlaylistItemId: string;
	DateCreated: string;
	DateLastMediaAdded: string;
	ExtraType: string;
	AirsBeforeSeasonNumber: number;
	AirsAfterSeasonNumber: number;
	AirsBeforeEpisodeNumber: number;
	CanDelete: boolean;
	CanDownload: boolean;
	HasLyrics: boolean;
	HasSubtitles: boolean;
	PreferredMetadataLanguage: string;
	PreferredMetadataCountryCode: string;
	Container: string;
	SortName: string;
	ForcedSortName: string;
	Video3DFormat: string;
	PremiereDate: string;
	ExternalUrls: ExternalUrl[];
	MediaSources: MediaSource[];
	CriticRating: number;
	ProductionLocations: string[];
	Path: string;
	EnableMediaSourceDisplay: boolean;
	OfficialRating: string;
	CustomRating: string;
	ChannelId: string;
	ChannelName: string;
	Overview: string;
	Taglines: string[];
	Genres: string[];
	CommunityRating: number;
	CumulativeRunTimeTicks: number;
	RunTimeTicks: number;
	PlayAccess: string;
	AspectRatio: string;
	ProductionYear: number;
	IsPlaceHolder: boolean;
	Number: string;
	ChannelNumber: string;
	IndexNumber: number;
	IndexNumberEnd: number;
	ParentIndexNumber: number;
	RemoteTrailers: RemoteTrailer[];
	ProviderIds: AdditionalProps;
	IsHD: boolean;
	IsFolder: boolean;
	ParentId: string;
	Type: string;
	People: Person[];
	Studios: Studio[];
	GenreItems: GenreItem[];
	ParentLogoItemId: string;
	ParentBackdropItemId: string;
	ParentBackdropImageTags: string[];
	LocalTrailerCount: number;
	UserData: UserData;
	RecursiveItemCount: number;
	ChildCount: number;
	SeriesName: string;
	SeriesId: string;
	SeasonId: string;
	SpecialFeatureCount: number;
	DisplayPreferencesId: string;
	Status: string;
	AirTime: string;
	AirDays: string[];
	Tags: string[];
	PrimaryImageAspectRatio: number;
	Artists: string[];
	ArtistItems: ArtistItem[];
	Album: string;
	CollectionType: string;
	DisplayOrder: string;
	AlbumId: string;
	AlbumPrimaryImageTag: string;
	SeriesPrimaryImageTag: string;
	AlbumArtist: string;
	AlbumArtists: AlbumArtist[];
	SeasonName: string;
	MediaStreams: MediaStream[];
	VideoType: string;
	PartCount: number;
	MediaSourceCount: number;
	ImageTags: AdditionalProps;
	BackdropImageTags: string[];
	ScreenshotImageTags: string[];
	ParentLogoImageTag: string;
	ParentArtItemId: string;
	ParentArtImageTag: string;
	SeriesThumbImageTag: string;
	ImageBlurHashes: ImageBlurHashes;
	SeriesStudio: string;
	ParentThumbItemId: string;
	ParentThumbImageTag: string;
	ParentPrimaryImageItemId: string;
	ParentPrimaryImageTag: string;
	Chapters: Chapter[];
	Trickplay: Trickplay;
	LocationType: string;
	IsoType: string;
	MediaType: string;
	EndDate: string;
	LockedFields: string[];
	TrailerCount: number;
	MovieCount: number;
	SeriesCount: number;
	ProgramCount: number;
	EpisodeCount: number;
	SongCount: number;
	AlbumCount: number;
	ArtistCount: number;
	MusicVideoCount: number;
	LockData: boolean;
	Width: number;
	Height: number;
	CameraMake: string;
	CameraModel: string;
	Software: string;
	ExposureTime: number;
	FocalLength: number;
	ImageOrientation: string;
	Aperture: number;
	ShutterSpeed: number;
	Latitude: number;
	Longitude: number;
	Altitude: number;
	IsoSpeedRating: number;
	SeriesTimerId: string;
	ProgramId: string;
	ChannelPrimaryImageTag: string;
	StartDate: string;
	CompletionPercentage: number;
	IsRepeat: boolean;
	EpisodeTitle: string;
	ChannelType: string;
	Audio: string;
	IsMovie: boolean;
	IsSports: boolean;
	IsSeries: boolean;
	IsLive: boolean;
	IsNews: boolean;
	IsKids: boolean;
	IsPremiere: boolean;
	TimerId: string;
	NormalizationGain: number;
	CurrentProgram: string;
}

interface TranscodingInfo {
	AudioCodec: string;
	VideoCodec: string;
	Container: string;
	IsVideoDirect: boolean;
	IsAudioDirect: boolean;
	Bitrate: number;
	Framerate: number;
	CompletionPercentage: number;
	Width: number;
	Height: number;
	AudioChannels: number;
	HardwareAccelerationType: string;
	TranscodeReasons: string[];
}

interface NowPlayingQueue {
	Id: string;
	PlaylistItemId: string;
}

interface NowPlayingQueueFullItem {
	Name: string;
	OriginalTitle: string;
	ServerId: string;
	Id: string;
	Etag: string;
	SourceType: string;
	PlaylistItemId: string;
	DateCreated: string;
	DateLastMediaAdded: string;
	ExtraType: string;
	AirsBeforeSeasonNumber: number;
	AirsAfterSeasonNumber: number;
	AirsBeforeEpisodeNumber: number;
	CanDelete: boolean;
	CanDownload: boolean;
	HasLyrics: boolean;
	HasSubtitles: boolean;
	PreferredMetadataLanguage: string;
	PreferredMetadataCountryCode: string;
	Container: string;
	SortName: string;
	ForcedSortName: string;
	Video3DFormat: string;
	PremiereDate: string;
	ExternalUrls: ExternalUrl[];
	MediaSources: MediaSource[];
	CriticRating: number;
	ProductionLocations: string[];
	Path: string;
	EnableMediaSourceDisplay: boolean;
	OfficialRating: string;
	CustomRating: string;
	ChannelId: string;
	ChannelName: string;
	Overview: string;
	Taglines: string[];
	Genres: string[];
	CommunityRating: number;
	CumulativeRunTimeTicks: number;
	RunTimeTicks: number;
	PlayAccess: string;
	AspectRatio: string;
	ProductionYear: number;
	IsPlaceHolder: boolean;
	Number: string;
	ChannelNumber: string;
	IndexNumber: number;
	IndexNumberEnd: number;
	ParentIndexNumber: number;
	RemoteTrailers: RemoteTrailer[];
	ProviderIds: AdditionalProps;
	IsHD: boolean;
	IsFolder: boolean;
	ParentId: string;
	Type: string;
	People: Person[];
	Studios: Studio[];
	GenreItems: GenreItem[];
	ParentLogoItemId: string;
	ParentBackdropItemId: string;
	ParentBackdropImageTags: string[];
	LocalTrailerCount: number;
	UserData: UserData;
	RecursiveItemCount: number;
	ChildCount: number;
	SeriesName: string;
	SeriesId: string;
	SeasonId: string;
	SpecialFeatureCount: number;
	DisplayPreferencesId: string;
	Status: string;
	AirTime: string;
	AirDays: string[];
	Tags: string[];
	PrimaryImageAspectRatio: number;
	Artists: string[];
	ArtistItems: ArtistItem[];
	Album: string;
	CollectionType: string;
	DisplayOrder: string;
	AlbumId: string;
	AlbumPrimaryImageTag: string;
	SeriesPrimaryImageTag: string;
	AlbumArtist: string;
	AlbumArtists: AlbumArtist[];
	SeasonName: string;
	MediaStreams: MediaStream[];
	VideoType: string;
	PartCount: number;
	MediaSourceCount: number;
	ImageTags: AdditionalProps;
	BackdropImageTags: string[];
	ScreenshotImageTags: string[];
	ParentLogoImageTag: string;
	ParentArtItemId: string;
	ParentArtImageTag: string;
	SeriesThumbImageTag: string;
	ImageBlurHashes: ImageBlurHashes;
	SeriesStudio: string;
	ParentThumbItemId: string;
	ParentThumbImageTag: string;
	ParentPrimaryImageItemId: string;
	ParentPrimaryImageTag: string;
	Chapters: Chapter[];
	Trickplay: Trickplay;
	LocationType: string;
	IsoType: string;
	MediaType: string;
	EndDate: string;
	LockedFields: string[];
	TrailerCount: number;
	MovieCount: number;
	SeriesCount: number;
	ProgramCount: number;
	EpisodeCount: number;
	SongCount: number;
	AlbumCount: number;
	ArtistCount: number;
	MusicVideoCount: number;
	LockData: boolean;
	Width: number;
	Height: number;
	CameraMake: string;
	CameraModel: string;
	Software: string;
	ExposureTime: number;
	FocalLength: number;
	ImageOrientation: string;
	Aperture: number;
	ShutterSpeed: number;
	Latitude: number;
	Longitude: number;
	Altitude: number;
	IsoSpeedRating: number;
	SeriesTimerId: string;
	ProgramId: string;
	ChannelPrimaryImageTag: string;
	StartDate: string;
	CompletionPercentage: number;
	IsRepeat: boolean;
	EpisodeTitle: string;
	ChannelType: string;
	Audio: string;
	IsMovie: boolean;
	IsSports: boolean;
	IsSeries: boolean;
	IsLive: boolean;
	IsNews: boolean;
	IsKids: boolean;
	IsPremiere: boolean;
	TimerId: string;
	NormalizationGain: number;
	CurrentProgram: string;
}
