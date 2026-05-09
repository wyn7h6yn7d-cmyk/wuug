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
