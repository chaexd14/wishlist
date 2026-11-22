"use client";

import {
  Avatar,
  AvatarStack,
  Breadcrumb,
  Buddy,
  Callout,
  Checkbox,
  Count,
  Doodle,
  IconButton,
  Menu,
  MoreIcon,
  Pagination,
  Progress,
  ProgressRing,
  SearchField,
  Skeleton,
  SkeletonText,
  Slider,
  Spinner,
  StatusDot,
  StatusTimeline,
  StickyNote,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TicketCard,
  Toast,
  Tooltip,
  WordSticker,
  toast,
  type BurstStyle,
  type ButtonVariant,
} from "@plop-ui/react";
import { useState } from "react";

import { JournalButton, JournalHeading, JournalSheet, JournalThemeSwitcher } from "@/components/journal";

const variants: ButtonVariant[] = ["ink", "periwinkle", "mint", "tomato", "mustard", "plain"];
const bursts: Array<{ style: BurstStyle; label: string; purpose: string }> = [
  { style: "confetti", label: "Confetti", purpose: "Save or send" },
  { style: "stars", label: "Stars", purpose: "A big birthday win" },
  { style: "sparkle", label: "Sparkle", purpose: "A quiet success" },
  { style: "hearts", label: "Hearts", purpose: "Favorite or love" },
  { style: "poof", label: "Poof", purpose: "Cancel or remove" },
  { style: "zap", label: "Zap", purpose: "An error" },
  { style: "drops", label: "Drops", purpose: "An oops moment" },
];

const searchGroups = [{
  id: "components",
  label: "UI Lab",
  items: [
    { id: "button", title: "Buttons", sub: "Actions and effects", lead: { dot: "bubblegum" as const } },
    { id: "forms", title: "Form controls", sub: "Choices and details", lead: { dot: "mint" as const } },
  ],
}];

export function UiLabPlayground() {
  const [page, setPage] = useState(2);

  return (
    <>
      <section className="gallery-section" id="themes" aria-labelledby="themes-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="themes-title">Four journal moods</JournalHeading>
          <p>Every mood shares the same lively color collection and readable paper foundation; only the dominant action color changes.</p>
        </div>
        <JournalThemeSwitcher />
      </section>

      <section className="gallery-section" id="buttons" aria-labelledby="buttons-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="buttons-title">Button shelf</JournalHeading>
          <p>Every PlopUI fill, size, shadow, and important interaction state in one place.</p>
        </div>
        <JournalSheet spacing="comfortable">
          <div className="lab-subsection">
            <h3>Color variants</h3>
            <div className="gallery-button-row">
              {variants.map((variant) => <JournalButton key={variant} variant={variant} seed={`variant-${variant}`}>{variant}</JournalButton>)}
            </div>
          </div>
          <div className="lab-subsection">
            <h3>Sizes and shadows</h3>
            <div className="gallery-button-row">
              <JournalButton size="sm" shadow="outline" seed="small-outline">Small outline</JournalButton>
              <JournalButton size="md" shadow="soft" seed="medium-soft">Medium soft</JournalButton>
              <JournalButton size="lg" shadow="solid" seed="large-solid">Large solid</JournalButton>
              <JournalButton variant="mustard" shadow="stripes" seed="striped">Striped</JournalButton>
              <JournalButton variant="plain" shadow="none" seed="no-shadow">No shadow</JournalButton>
            </div>
          </div>
          <div className="lab-subsection">
            <h3>States and buddies</h3>
            <div className="gallery-button-row">
              <JournalButton buddy="peek" buddyMood="success" seed="buddy-success">Buddy peek</JournalButton>
              <JournalButton variant="tomato" buddy buddyMood="error" seed="buddy-error">Retry</JournalButton>
              <JournalButton loading loadingLabel="Saving the gift">Saving</JournalButton>
              <JournalButton disabled variant="plain">Unavailable</JournalButton>
              <Tooltip content="Edit the selected gift">
                <IconButton icon={<Doodle kind="sparkle" size={24} />} label="Edit selected gift" variant="periwinkle" />
              </Tooltip>
            </div>
          </div>
        </JournalSheet>
      </section>

      <section className="gallery-section" id="effects" aria-labelledby="effects-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="effects-title">Burst playground</JournalHeading>
          <p>Press each sticker to preview its effect. Reduced-motion preferences are respected.</p>
        </div>
        <div className="lab-card-grid">
          {bursts.map((burst) => (
            <JournalSheet spacing="compact" key={burst.style}>
              <JournalButton
                variant={burst.style === "poof" || burst.style === "zap" || burst.style === "drops" ? "tomato" : "periwinkle"}
                burst={burst.style}
                seed={`burst-${burst.style}`}
              >
                {burst.label}
              </JournalButton>
              <p>{burst.purpose}</p>
            </JournalSheet>
          ))}
          <JournalSheet spacing="compact">
            <JournalButton burst={["#E9A7B8", "#C5B3E6", "#A9D8EA", "#A8D5B5", "#F0C85E"]} seed="custom-confetti">Custom mix</JournalButton>
            <p>The shared birthday color collection</p>
          </JournalSheet>
        </div>
      </section>

      <section className="gallery-section" id="navigation" aria-labelledby="navigation-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="navigation-title">Navigation desk</JournalHeading>
          <p>Patterns for browsing gifts, moving through checkout, and managing submissions.</p>
        </div>
        <JournalSheet spacing="comfortable" className="lab-subsection">
          <Breadcrumb items={[{ label: "Gifts", href: "/gifts" }, { label: "Accessories", href: "/gifts" }, { label: "Journal set" }]} />
          <Tabs defaultValue="details">
            <TabList label="Gift information">
              <Tab value="details">Details</Tab>
              <Tab value="options" badge={<Count label="3 options">3</Count>}>Options</Tab>
              <Tab value="notes">Notes</Tab>
            </TabList>
            <TabPanel value="details">A calm paper panel for the selected gift.</TabPanel>
            <TabPanel value="options">Color, quantity, and customization belong here.</TabPanel>
            <TabPanel value="notes">A personal note can be reviewed here.</TabPanel>
          </Tabs>
          <div className="gallery-button-row">
            <Menu label="Gift actions" icon={<MoreIcon />} items={[{ label: "Edit gift", onSelect: () => undefined }, { label: "Duplicate", onSelect: () => undefined }, "separator", { label: "Remove", danger: true, onSelect: () => undefined }]} />
            <SearchField label="Search UI Lab" placeholder="Find a component" groups={searchGroups} />
          </div>
          <Pagination page={page} pageCount={7} onPageChange={setPage} showEnds aria-label="Gift catalog pages" />
        </JournalSheet>
      </section>

      <section className="gallery-section" id="feedback" aria-labelledby="lab-feedback-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="lab-feedback-title">Feedback and progress</JournalHeading>
          <p>Status always uses words as well as color, and motion is reserved for active work.</p>
        </div>
        <div className="lab-two-column">
          <Callout tone="info" title="A useful note">This gift can be customized.</Callout>
          <Callout tone="success" title="Saved in your journal" buddy>Your choices are ready.</Callout>
          <Callout tone="warn" title="One detail is missing">Choose a color to continue.</Callout>
          <Callout tone="error" title="Could not save" buddy role="alert">Try again without losing your note.</Callout>
        </div>
        <JournalSheet spacing="comfortable" className="lab-subsection">
          <div className="gallery-button-row">
            <JournalButton onClick={() => toast("Here is a useful note", { buddy: "preview", burst: "sparkle" })}>Info toast</JournalButton>
            <JournalButton variant="mint" onClick={() => toast.success("Wishlist submitted", { buddy: "congrats", burst: "stars" })}>Success toast</JournalButton>
            <JournalButton variant="tomato" onClick={() => toast.error("Could not save", { buddy: "error", burst: "zap" })}>Error toast</JournalButton>
          </div>
          <div className="lab-two-column">
            <Toast kind="success" buddy>Wishlist saved</Toast>
            <Toast kind="error" buddy>Something needs attention</Toast>
          </div>
          <div className="gallery-tag-row">
            <StatusDot tone="online">Available</StatusDot>
            <StatusDot tone="busy">Limited stock</StatusDot>
            <StatusDot tone="offline">Unavailable</StatusDot>
            <Count label="4 gifts selected">4</Count>
          </div>
          <Progress label="Wishlist details" value={72} tone="mint" />
          <div className="gallery-button-row">
            <ProgressRing label="Checkout progress" value={75} valueText="3 of 4" tone="mint" seed="checkout-ring" />
            {(["ink", "dots", "scribble", "sticker", "buddy"] as const).map((kind) => <Spinner key={kind} kind={kind} label={`${kind} loading`} showLabel />)}
          </div>
          <StatusTimeline steps={["Picked", "Reviewed", "Submitted", "Purchased"]} current={2} />
          <div className="lab-two-column">
            <SkeletonText lines={3} seed="lab-text" />
            <Skeleton shape="block" height={110} seed="lab-card" />
          </div>
        </JournalSheet>
      </section>

      <section className="gallery-section" id="journal-content" aria-labelledby="content-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="content-title">Journal pieces</JournalHeading>
          <p>Content objects that can carry real wishlist and purchasing information.</p>
        </div>
        <div className="lab-card-grid">
          <StickyNote tone="mustard" footer="A note for later">Check whether engraving is available.</StickyNote>
          <TicketCard meta="Submission example" title="Birthday wishlist" stub="Open">Four gifts with complete details</TicketCard>
          <JournalSheet spacing="compact">
            <div className="gallery-button-row"><Avatar name="Her" status="online" /><AvatarStack names={["Her", "Gift helper", "Shop assistant", "Courier"]} /></div>
            <p>Avatar and compact group states.</p>
          </JournalSheet>
          <JournalSheet spacing="compact">
            <div className="gallery-button-row">
              {(["success", "error", "stale", "congrats", "preview", "thinking"] as const).map((mood) => <Buddy key={mood} mood={mood} size="sm" label={`${mood} buddy`} />)}
            </div>
          </JournalSheet>
          <JournalSheet spacing="compact">
            <WordSticker tone="bubblegum" size={34} tilt={-2}>favorite</WordSticker>
            <div className="gallery-button-row">
              <Doodle kind="heart" tone="tomato" /><Doodle kind="star" tone="mustard" /><Doodle kind="sparkle" tone="periwinkle" /><Doodle kind="burst" tone="mint" />
            </div>
          </JournalSheet>
          <JournalSheet spacing="compact" className="lab-subsection">
            <Switch defaultChecked>Notify me when submitted</Switch>
            <Slider label="Gift priority" defaultValue={70} showValue ticks={5} tone="bubblegum" />
            <Checkbox defaultChecked>Include gift wrapping</Checkbox>
          </JournalSheet>
        </div>
      </section>
    </>
  );
}
