import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageCircleMore,
  PhoneCall,
  Send,
} from "lucide-react";

export const navigationItems = [
  { href: "/", label: "Avaleht" },
  { href: "/clients", label: "Kliendid" },
  { href: "/projects", label: "Projektid" },
  { href: "/tasks", label: "Tegevused" },
  { href: "/radar", label: "Radar" },
  { href: "/promises", label: "Lubadused" },
  { href: "/settings", label: "Seaded" },
];

export const topMetrics = [
  { title: "Täna", value: "8 tegevust", tone: "blue" as const },
  { title: "Ootab klienti", value: "3 asja", tone: "violet" as const },
  { title: "Hilinemise risk", value: "2 projekti", tone: "orange" as const },
  {
    title: "Ilma järgmise sammuta",
    value: "5 klienti",
    tone: "neutral" as const,
  },
];

export const todayTasks = [
  {
    icon: Send,
    title: "Saada pakkumine",
    context: "Nordic OÜ",
    due: "Täna 11:00",
    status: "Tegemisel",
    tone: "blue" as const,
  },
  {
    icon: PhoneCall,
    title: "Helista kliendile",
    context: "Greenfield OÜ",
    due: "Täna 14:00",
    status: "Planeeritud",
    tone: "neutral" as const,
  },
  {
    icon: MessageCircleMore,
    title: "Küsi kinnitust",
    context: "Ruum Disain OÜ",
    due: "Täna 16:00",
    status: "Ootab klienti",
    tone: "violet" as const,
  },
  {
    icon: AlertTriangle,
    title: "Vaata projekt üle",
    context: "Lumen OÜ",
    due: "Täna 17:30",
    status: "Risk",
    tone: "orange" as const,
  },
];

export const quickAddItems = [
  "Uus klient",
  "Uus projekt",
  "Uus tegevus",
  "Uus lubadus",
];

export const focusInsights = [
  "Alusta pakkumisest Nordic OÜ-le",
  "3 klienti ootavad vastust",
  "2 projekti vajavad täna tähelepanu",
];

export const stalledItems = [
  {
    title: "Klienti ilma järgmise sammuta",
    value: "5",
    helper: "Vaata, kellel puudub konkreetne järgmine tegevus.",
    icon: Clock3,
    tone: "neutral" as const,
  },
  {
    title: "Projekti pole 7 päeva liikunud",
    value: "2",
    helper: "Tuvasta pudelikaelad enne kui tähtaeg läheb mööda.",
    icon: CalendarClock,
    tone: "orange" as const,
  },
  {
    title: "Lubadust aeguvad sel nädalal",
    value: "4",
    helper: "Täida antud lubadused enne kliendi meeldetuletust.",
    icon: CheckCircle2,
    tone: "violet" as const,
  },
];

export const pageHighlights = {
  clients: [
    "5 klienti vajavad järgmist sammu",
    "2 klienti ootavad pakkumist",
    "Keskmine vastuseaeg 1.2 päeva",
  ],
  projects: [
    "2 projekti on hilinemise riskis",
    "4 projekti liiguvad plaani järgi",
    "1 projekt vajab kliendi kinnitust",
  ],
  tasks: [
    "8 tegevust täna",
    "3 tegevust ootavad klienti",
    "2 tegevust on üle tähtaja",
  ],
  radar: [
    "3 vaikset klienti üle 10 päeva",
    "2 projekti pole liikunud nädal",
    "4 lubadust aeguvad 7 päeva jooksul",
  ],
  promises: [
    "4 lubadust aeguvad sel nädalal",
    "2 lubadust vajavad kinnitust",
    "6 lubadust on täidetud kuus",
  ],
  settings: [
    "Teavitused on sees e-mailis ja veebis",
    "Tööpäev algab kell 09:00",
    "Meeskonnas on 4 aktiivset kasutajat",
  ],
};

export const clientMetrics = [
  { title: "Aktiivsed kliendid", value: "24", tone: "blue" as const },
  { title: "Vajavad vastust", value: "6", tone: "violet" as const },
  { title: "Kõrge prioriteet", value: "3", tone: "orange" as const },
  { title: "Ilma järgmise sammuta", value: "5", tone: "neutral" as const },
];

export const clientsList = [
  {
    name: "Nordic OÜ",
    initials: "NO",
    contactName: "Kontaktisik",
    contactEmail: "martin@nordic.ee",
    status: "Aktiivne",
    statusTone: "green" as const,
    nextStep: "Saada pakkumine",
    due: "Täna 11:00",
    owner: "Sina",
    needsAttention: true,
    hasNextStep: true,
    note: "Klient eelistab kiiret e-maili kinnitust enne hinnapakkumise saatmist.",
    activeProject: "Veebiplatvormi uuendus",
  },
  {
    name: "Greenfield OÜ",
    initials: "GO",
    contactName: "Kontaktisik",
    contactEmail: "katri@greenfield.ee",
    status: "Aktiivne",
    statusTone: "green" as const,
    nextStep: "Helista kliendile",
    due: "Täna 14:00",
    owner: "Sina",
    needsAttention: true,
    hasNextStep: true,
    note: "Arutada projekti ulatust ja kinnitada järgmine arve.",
    activeProject: "Brändi maandumisleht",
  },
  {
    name: "Ruum Disain OÜ",
    initials: "RD",
    contactName: "Kontaktisik",
    contactEmail: "joonas@ruumdisain.ee",
    status: "Vastust ootab",
    statusTone: "violet" as const,
    nextStep: "Küsi kinnitust",
    due: "Täna 16:00",
    owner: "Sina",
    needsAttention: true,
    hasNextStep: true,
    note: "Ootame kliendi otsust enne arendusetapi alustamist.",
    activeProject: "Interjööriportfelli sait",
  },
  {
    name: "Lumen OÜ",
    initials: "LO",
    contactName: "Kontaktisik",
    contactEmail: "liisa@lumen.ee",
    status: "Aktiivne",
    statusTone: "green" as const,
    nextStep: "Vaata projekt üle",
    due: "Täna 17:30",
    owner: "Sina",
    needsAttention: false,
    hasNextStep: true,
    note: "Sisemine kvaliteedikontroll enne kliendikohtumist.",
    activeProject: "Mobiilirakenduse UX sprint",
  },
  {
    name: "Scandium Kinnisvara",
    initials: "SK",
    contactName: "Kontaktisik",
    contactEmail: "priit@scandium.ee",
    status: "Kõrge prioriteet",
    statusTone: "orange" as const,
    nextStep: "Lepingu ülevaatus",
    due: "Homme 10:00",
    owner: "Sina",
    needsAttention: true,
    hasNextStep: true,
    note: "Leping vajab õiguslikku kooskõlastust enne allkirjastamist.",
    activeProject: "Müügitoru automatiseerimine",
  },
  {
    name: "Põhjanael Stuudio",
    initials: "PS",
    contactName: "Kontaktisik",
    contactEmail: "mari@pohjanael.ee",
    status: "Aktiivne",
    statusTone: "green" as const,
    nextStep: "",
    due: "-",
    owner: "Sina",
    needsAttention: true,
    hasNextStep: false,
    note: "Viimane kohtumine toimus eelmisel nädalal, uus tegevus on määramata.",
    activeProject: "Sisukalendri planeerimine",
  },
];

export const projectMetrics = [
  { title: "Aktiivsed", value: "12 projekti", tone: "blue" as const },
  { title: "Ootab klienti", value: "3 projekti", tone: "violet" as const },
  { title: "Hilinemise risk", value: "2 projekti", tone: "orange" as const },
  { title: "Valmis sel nädalal", value: "4 projekti", tone: "green" as const },
];

export const projectColumns = [
  { key: "alustamata", label: "Alustamata" },
  { key: "toos", label: "Töös" },
  { key: "ootab-klienti", label: "Ootab klienti" },
  { key: "valmis", label: "Valmis" },
] as const;

export const projectsBoard = [
  {
    title: "Brändi uuendus",
    client: "Lumen OÜ",
    deadline: "30. mai",
    progress: 0,
    nextStep: "Planeerimine",
    status: "Alustamata",
    statusTone: "neutral" as const,
    column: "alustamata",
    hasNextStep: true,
  },
  {
    title: "E-poe arendus",
    client: "Lumen OÜ",
    deadline: "20. juuni",
    progress: 0,
    nextStep: "Planeerimine",
    status: "Alustamata",
    statusTone: "neutral" as const,
    column: "alustamata",
    hasNextStep: true,
  },
  {
    title: "Veebilehe arendus",
    client: "Nordic OÜ",
    deadline: "11. juuni",
    progress: 60,
    nextStep: "Disain kinnitamisel",
    status: "Töös",
    statusTone: "blue" as const,
    column: "toos",
    hasNextStep: true,
  },
  {
    title: "Turundusstrateegia",
    client: "Greenfield OÜ",
    deadline: "14. juuni",
    progress: 40,
    nextStep: "Uuringud",
    status: "Töös",
    statusTone: "blue" as const,
    column: "toos",
    hasNextStep: true,
  },
  {
    title: "Brändi identiteet",
    client: "Ruum Disain OÜ",
    deadline: "16. juuni",
    progress: 30,
    nextStep: "Kontseptsioon",
    status: "Töös",
    statusTone: "blue" as const,
    column: "toos",
    hasNextStep: true,
  },
  {
    title: "Mobiilirakendus",
    client: "Bright OÜ",
    deadline: "18. juuni",
    progress: 75,
    nextStep: "Kliendi tagasiside",
    status: "Ootab klienti",
    statusTone: "violet" as const,
    column: "ootab-klienti",
    hasNextStep: true,
  },
  {
    title: "Sisuturunduse plaan",
    client: "Nordic OÜ",
    deadline: "22. juuni",
    progress: 50,
    nextStep: "Saada pakkumine",
    status: "Ootab klienti",
    statusTone: "violet" as const,
    column: "ootab-klienti",
    hasNextStep: true,
  },
  {
    title: "Kodulehe hooldus",
    client: "Wave OÜ",
    deadline: "5. juuni",
    progress: 100,
    nextStep: "Valmis",
    status: "Valmis",
    statusTone: "green" as const,
    column: "valmis",
    hasNextStep: true,
  },
  {
    title: "Sotsiaalmeedia audit",
    client: "Bright OÜ",
    deadline: "2. juuni",
    progress: 100,
    nextStep: "Valmis",
    status: "Valmis",
    statusTone: "green" as const,
    column: "valmis",
    hasNextStep: true,
  },
  {
    title: "SEO täiustused",
    client: "Põhjanael Stuudio",
    deadline: "28. juuni",
    progress: 15,
    nextStep: "",
    status: "Töös",
    statusTone: "orange" as const,
    column: "toos",
    hasNextStep: false,
  },
];

export const selectedProject = {
  title: "Veebilehe arendus",
  client: "Nordic OÜ",
  progress: 60,
  expectedFinish: "11. juuni 2025",
  nextMilestone: "Disain kinnitamisel",
  owner: "Sina",
  checklist: [
    "Nõuded ja eesmärgid",
    "Kavand ja struktuur",
    "Disain",
    "Arendus",
    "Testimine ja ülevaatus",
    "Lõppviimistlus",
  ],
};

export const taskMetrics = [
  { title: "Täna", value: "8 ülesannet", tone: "blue" as const },
  { title: "Sel nädalal", value: "15 ülesannet", tone: "violet" as const },
  { title: "Hilinenud", value: "3 ülesannet", tone: "orange" as const },
  { title: "Ootab klienti", value: "6 ülesannet", tone: "neutral" as const },
];

export const taskGroups = [
  {
    title: "Täna",
    items: [
      {
        icon: Send,
        iconTone: "text-blue-600 bg-blue-50",
        title: "Saada pakkumine",
        context: "Nordic OÜ",
        due: "Täna 11:00",
        status: "Tegemisel",
        statusTone: "blue" as const,
        priority: "Kõrge",
        priorityTone: "bg-orange-100 text-orange-700",
      },
      {
        icon: PhoneCall,
        iconTone: "text-slate-600 bg-slate-100",
        title: "Helista kliendile",
        context: "Greenfield OÜ",
        due: "Täna 14:00",
        status: "Planeeritud",
        statusTone: "neutral" as const,
        priority: "Keskmine",
        priorityTone: "bg-blue-100 text-blue-700",
      },
      {
        icon: MessageCircleMore,
        iconTone: "text-violet-600 bg-violet-50",
        title: "Küsi kinnitust",
        context: "Ruum Disain OÜ",
        due: "Täna 16:00",
        status: "Ootab klienti",
        statusTone: "violet" as const,
        priority: "Kõrge",
        priorityTone: "bg-orange-100 text-orange-700",
      },
      {
        icon: AlertTriangle,
        iconTone: "text-orange-600 bg-orange-50",
        title: "Vaata projekt üle",
        context: "Lumen OÜ",
        due: "Täna 17:30",
        status: "Risk",
        statusTone: "orange" as const,
        priority: "Kõrge",
        priorityTone: "bg-red-100 text-red-700",
      },
    ],
  },
  {
    title: "Sel nädalal",
    items: [
      {
        icon: CalendarClock,
        iconTone: "text-blue-600 bg-blue-50",
        title: "Lepingu ettevalmistus",
        context: "Buildit OÜ",
        due: "21. mai",
        status: "Planeeritud",
        statusTone: "neutral" as const,
        priority: "Keskmine",
        priorityTone: "bg-blue-100 text-blue-700",
      },
      {
        icon: CalendarClock,
        iconTone: "text-violet-600 bg-violet-50",
        title: "Kohtumine kliendiga",
        context: "Nordic OÜ",
        due: "22. mai",
        status: "Planeeritud",
        statusTone: "neutral" as const,
        priority: "Keskmine",
        priorityTone: "bg-blue-100 text-blue-700",
      },
      {
        icon: CheckCircle2,
        iconTone: "text-emerald-600 bg-emerald-50",
        title: "Esita aruanne",
        context: "Greenfield OÜ",
        due: "24. mai",
        status: "Planeeritud",
        statusTone: "neutral" as const,
        priority: "Madal",
        priorityTone: "bg-emerald-100 text-emerald-700",
      },
    ],
  },
  {
    title: "Hilinenud",
    items: [
      {
        icon: AlertTriangle,
        iconTone: "text-red-600 bg-red-50",
        title: "Kinnita muudatused",
        context: "Ruum Disain OÜ",
        due: "16. mai",
        status: "Hilinenud",
        statusTone: "orange" as const,
        priority: "Kõrge",
        priorityTone: "bg-red-100 text-red-700",
      },
      {
        icon: AlertTriangle,
        iconTone: "text-red-600 bg-red-50",
        title: "Saada dokumendid",
        context: "Lumen OÜ",
        due: "17. mai",
        status: "Hilinenud",
        statusTone: "orange" as const,
        priority: "Kõrge",
        priorityTone: "bg-red-100 text-red-700",
      },
      {
        icon: AlertTriangle,
        iconTone: "text-red-600 bg-red-50",
        title: "Võta ühendust",
        context: "Buildit OÜ",
        due: "18. mai",
        status: "Hilinenud",
        statusTone: "orange" as const,
        priority: "Kõrge",
        priorityTone: "bg-red-100 text-red-700",
      },
    ],
  },
];

export const dueSoonItems = [
  { title: "Saada pakkumine", date: "Täna", time: "11:00" },
  { title: "Küsi kinnitust", date: "Täna", time: "16:00" },
  { title: "Kohtumine kliendiga", date: "22. mai", time: "10:30" },
];

export const focusModeTask = {
  title: "Saada pakkumine",
  context: "Nordic OÜ",
  due: "Täna 11:00",
  status: "Tegemisel",
};

export const radarMetrics = [
  { title: "Seisvad kliendid", value: "5", tone: "violet" as const },
  { title: "Projektid riskis", value: "2", tone: "orange" as const },
  { title: "Lubadused aegumas", value: "4", tone: "blue" as const },
  { title: "Järgmine samm puudub", value: "7", tone: "neutral" as const },
];

export const radarSections = [
  {
    title: "Seisvad kliendid",
    description: "Kliendid, kellega pole mitu päeva tegevust olnud.",
    tone: "violet" as const,
    items: [
      { name: "Nordic OÜ", meta: "pole liikunud 6 päeva", action: "Lisa järgmine samm" },
      { name: "Buildit OÜ", meta: "pole liikunud 9 päeva", action: "Võta ühendust" },
      { name: "Wave OÜ", meta: "pole liikunud 12 päeva", action: "Kontrolli staatust" },
    ],
  },
  {
    title: "Projektid riskis",
    description: "Projektid, mille tähtaeg või järgmine etapp on ohus.",
    tone: "orange" as const,
    items: [
      {
        name: "Veebilehe arendus",
        meta: "tähtaeg 11. juuni",
        action: "risk: ootab kinnitust",
      },
      {
        name: "Brändi identiteet",
        meta: "tähtaeg 16. juuni",
        action: "risk: järgmine samm puudub",
      },
    ],
  },
  {
    title: "Lubadused aegumas",
    description: "Kliendile antud lubadused, mille tähtaeg läheneb.",
    tone: "blue" as const,
    items: [
      { name: "Saada pakkumine Nordic OÜ-le", meta: "täna 11:00", action: "Valmista ette" },
      {
        name: "Esitada disainivariandid Ruum Disain OÜ-le",
        meta: "homme",
        action: "Kinnita sisu",
      },
      { name: "Saata aruanne Greenfield OÜ-le", meta: "24. mai", action: "Koosta aruanne" },
    ],
  },
  {
    title: "Ilma vastutajata",
    description: "Asjad, millel puudub omanik.",
    tone: "neutral" as const,
    items: [
      { name: "Uus päring: Scandium Kinnisvara", meta: "vajab omanikku", action: "Määra vastutaja" },
      { name: "Projekt: E-poe arendus", meta: "omanik määramata", action: "Määra vastutaja" },
      { name: "Lubadus: Saada lepingu mustand", meta: "omanik määramata", action: "Määra vastutaja" },
    ],
  },
];

export const radarSuggestions = [
  "Alusta Nordic OÜ pakkumisest, sest tähtaeg on täna.",
  "Lisa vastutaja Scandium Kinnisvara päringule.",
  "Ruum Disain OÜ ootab kinnitust - saada meeldetuletus.",
];

export const promiseMetrics = [
  { title: "Aktiivsed lubadused", value: "18", tone: "blue" as const },
  { title: "Täna tähtajaga", value: "3", tone: "violet" as const },
  { title: "Aegumas sel nädalal", value: "6", tone: "orange" as const },
  { title: "Hilinenud", value: "2", tone: "neutral" as const },
];

export const promiseSections = [
  {
    title: "Täna",
    items: [
      {
        title: "Saada pakkumine",
        client: "Nordic OÜ",
        owner: "Sina",
        due: "Täna 11:00",
        status: "Tähtaeg täna",
        statusTone: "orange" as const,
      },
      {
        title: "Saada disainiparandused",
        client: "Ruum Disain OÜ",
        owner: "Sina",
        due: "Täna 16:00",
        status: "Planeeritud",
        statusTone: "blue" as const,
      },
    ],
  },
  {
    title: "Sel nädalal",
    items: [
      {
        title: "Saata lepingu mustand",
        client: "Scandium Kinnisvara",
        owner: "Sina",
        due: "Homme",
        status: "Aegumas",
        statusTone: "violet" as const,
      },
      {
        title: "Esitada kampaania kokkuvõte",
        client: "Greenfield OÜ",
        owner: "Sina",
        due: "24. mai",
        status: "Planeeritud",
        statusTone: "blue" as const,
      },
      {
        title: "Uuendada projekti ajakava",
        client: "Lumen OÜ",
        owner: "Sina",
        due: "25. mai",
        status: "Planeeritud",
        statusTone: "blue" as const,
      },
    ],
  },
  {
    title: "Hilinenud",
    items: [
      {
        title: "Saata dokumendid",
        client: "Buildit OÜ",
        owner: "Sina",
        due: "17. mai",
        status: "Hilinenud",
        statusTone: "orange" as const,
      },
      {
        title: "Kinnitada muudatused",
        client: "Ruum Disain OÜ",
        owner: "Sina",
        due: "16. mai",
        status: "Hilinenud",
        statusTone: "orange" as const,
      },
    ],
  },
  {
    title: "Täidetud",
    items: [
      {
        title: "Saata kohtumise kokkuvõte",
        client: "Wave OÜ",
        owner: "Sina",
        due: "18. mai",
        status: "Täidetud",
        statusTone: "green" as const,
      },
      {
        title: "Uuendada hinnastuse dokument",
        client: "Nordic OÜ",
        owner: "Sina",
        due: "19. mai",
        status: "Täidetud",
        statusTone: "green" as const,
      },
    ],
  },
];

export const settingsCompany = {
  name: "wuug Studio OÜ",
  logo: "WS",
  industry: "Digiteenused",
  timezone: "Europe/Tallinn (UTC+2)",
};

export const settingsUsers = [{ name: "Sina", role: "Omanik" }];

export const settingsNotificationToggles = [
  { label: "Hilinenud tegevused", enabled: true },
  { label: "Lubadused aegumas", enabled: true },
  { label: "Kliendid ilma järgmise sammuta", enabled: true },
  { label: "Päeva kokkuvõte e-postile", enabled: false },
];

export const workflowStatuses = ["Alustamata", "Töös", "Ootab klienti", "Valmis"];

export const integrations = ["Google Calendar", "Gmail", "Outlook", "Slack", "Zapier"];

export const onboardingSteps = [
  "Lisa ettevõtte info",
  "Lisa esimene klient",
  "Lisa esimene projekt",
  "Lisa esimene tegevus",
  "Ava töölaud",
];
