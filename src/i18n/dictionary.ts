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
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    subtitleBold: string;
  };
  announcement: {
    badge: string;
    text: string;
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
