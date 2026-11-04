export interface FeatureItem {
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface FaqEntryText {
  question: string;
  answer: string;
}

export interface Dictionary {
  nav: {
    howItWorks: string;
    feedback: string;
    faq: string;
  };
  /** One-line notice under the header announcing the redesign. */
  announcement: {
    badge: string;
    text: string;
    link: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    subtitleBold: string;
  };
  trustBadges: {
    gpxStandard: string;
    exactRoute: string;
    allModes: string;
    noSignup: string;
  };
  features: {
    heading: string;
    subheading: string;
    items: FeatureItem[];
  };
  howItWorks: {
    heading: string;
    subheading: string;
    steps: HowItWorksStep[];
  };
  feedbackSection: {
    heading: string;
    subheading: string;
  };
  donate: {
    heading: string;
    description: string;
  };
  donateLinks: { venmo: string; paypal: string };
  footer: {
    builtBy: string;
    faqLink: string;
    privacyLink: string;
    tagline: string;
  };
  converterForm: {
    placeholder: string;
    convertButton: string;
    convertingButton: string;
    stepLabels: {
      idle: string;
      resolving: string;
      routing: string;
      done: string;
      error: string;
    };
    invalidUrlError: string;
    networkError: string;
    nonJsonError: string;
    conversionFailedFallback: string;
    successBanner: string;
    distanceLabel: string;
    waypointsLabel: string;
    downloadButton: string;
    newButton: string;
    /** Title of the legend box that holds the converter. */
    legendTitle: string;
    map: {
      sampleLabel: string;
      yourRoute: string;
      start: string;
      finish: string;
      /** Accessible description of the illustrative sample route. */
      sampleAlt: string;
      /** Accessible description of the converted route; "{km}" is replaced with the distance. */
      routeAlt: string;
      /** Shown under the converted route: north is up, the terrain is decorative. */
      caption: string;
    };
  };
  feedbackForm: {
    ratingQuestion: string;
    optionalHint: string;
    ratingLabels: string[];
    /** "{n}" is replaced with the star count. */
    starAriaLabelOne: string;
    starAriaLabelMany: string;
    messageLabel: string;
    messageHint: string;
    messagePlaceholder: string;
    emailLabel: string;
    emailHint: string;
    emailPlaceholder: string;
    sendButton: string;
    sendingButton: string;
    sendMoreButton: string;
    thanksHeading: string;
    thanksSubtext: string;
    errorFallback: string;
    /** Shown when the form is sent with neither a rating nor a message. */
    emptyError: string;
  };
  homeMeta: {
    title: string;
    description: string;
  };
  faqMeta: {
    title: string;
    description: string;
  };
  faqPage: {
    heading: string;
    introPrefix: string;
    sendFeedbackLink: string;
    introSuffix: string;
    privacyNotePrefix: string;
    privacyLinkText: string;
    privacyNoteSuffix: string;
    backButton: string;
    entries: FaqEntryText[];
  };
  languageSwitcherLabel: string;
}
