const AVATAR_CIRCLE_SIZE = 192;
const AVATAR_IMAGE       = 'https://gravatar.com/avatar/4a9bc180ede1edddb33c44d535e4c32e?s=200&d=mp&r=x';

export class AvatarOptions {
  image?: string;
  size?: number;

  constructor() {
    this.size  = AVATAR_CIRCLE_SIZE;
    this.image = AVATAR_IMAGE;
  }
}
