export type ImageList = string[];

export type Person = {
  name: string;
  imageUrls: ImageList;
  father?: string;
  mother?: string;
  notes?: string;
  socialMedia?: { instagram?: string; facebook?: string };
};

export type Event = {
  type: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  locationUrl?: string;
  images?: ImageList;
};

export type Gift =
  | {
      type: 'bank';
      name: string;
      accountNumber: string;
      accountHolder: string;
    }
  | {
      type: 'physical';
      description: string;
      images?: ImageList;
    };

export type LoveStoryItem = {
  id: string;
  title: string;
  date?: string;
  description: string;
  image?: string;
};

export type EventData = {
  cover: { imageUrls: ImageList };
  quote: { text?: string; source?: string; imageUrls: ImageList };

  bride: Person;
  groom: Person;

  gallery: ImageList;

  events: Event[];

  gifts: Gift[];

  love_story: {
    stories: LoveStoryItem[];
    videos: string[];
  };

  closing: {
    message: string;
    images?: ImageList;
  };
};
