import { useTranslation } from "react-i18next";
import type { CatBehavioralProfile, TriState, Vocality, AffectionStyle, SpecialBehavior } from "@/api/types";

const ALL_SPECIAL_BEHAVIORS: SpecialBehavior[] = [
  "hunts_objects", "follows_everywhere", "sleeps_nearby", "own_bowl_only",
  "fears_loud_noises", "fears_strangers", "private_litter_only", "marks_territory",
];

const PawScale = ({ value, max = 5, onChange }: { value: number; max?: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-1">
    {Array.from({ length: max }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange?.(i + 1)}
        disabled={!onChange}
        className={`text-base transition-transform ${i < value ? "text-primary scale-110" : "text-muted-foreground/30"} ${onChange ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
      >
        🐾
      </button>
    ))}
  </div>
);

interface TriStatePickerProps {
  value: TriState;
  onChange?: (v: TriState) => void;
}

const TriStatePicker = ({ value, onChange }: TriStatePickerProps) => {
  const { t } = useTranslation();
  const options: { val: TriState; label: string }[] = [
    { val: "yes", label: t("behavioral.yes") },
    { val: "no", label: t("behavioral.no") },
    { val: "untested", label: t("behavioral.untested") },
  ];
  return (
    <div className="flex gap-1.5">
      {options.map((o) => (
        <button
          key={o.val}
          type="button"
          onClick={() => onChange?.(o.val)}
          disabled={!onChange}
          className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-colors ${
            value === o.val
              ? o.val === "yes" ? "bg-primary/10 text-primary border border-primary/30"
                : o.val === "no" ? "bg-destructive/10 text-destructive border border-destructive/30"
                : "bg-muted text-muted-foreground border border-border"
              : "border border-input text-muted-foreground"
          } ${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

interface Props {
  profile: CatBehavioralProfile;
  onChange?: (profile: CatBehavioralProfile) => void;
  readOnly?: boolean;
}

export const emptyBehavioralProfile = (): CatBehavioralProfile => ({
  sociabilityHumans: 3,
  sociabilityCats: 3,
  sociabilityChildren: "untested",
  sociabilityDogs: "untested",
  energyLevel: 3,
  aloneToleranceHours: 4,
  vocality: "normal",
  affectionStyle: "accepts",
  specialBehaviors: [],
  source: "shelter",
});

const BehavioralProfileForm = ({ profile, onChange, readOnly }: Props) => {
  const { t } = useTranslation();

  const update = (partial: Partial<CatBehavioralProfile>) => {
    onChange?.({ ...profile, ...partial });
  };

  const toggleBehavior = (b: SpecialBehavior) => {
    const list = profile.specialBehaviors || [];
    update({
      specialBehaviors: list.includes(b) ? list.filter((x) => x !== b) : [...list, b],
    });
  };

  return (
    <div className="space-y-4">
      {/* Scale dimensions */}
      <div className="space-y-3">
        {/* Sociability humans */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">{t("behavioral.sociabilityHumans")}</p>
            <p className="text-[10px] text-muted-foreground">{t("behavioral.sociabilityHumansHint")}</p>
          </div>
          <PawScale value={profile.sociabilityHumans} onChange={readOnly ? undefined : (v) => update({ sociabilityHumans: v })} />
        </div>

        {/* Sociability cats */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">{t("behavioral.sociabilityCats")}</p>
            <p className="text-[10px] text-muted-foreground">{t("behavioral.sociabilityCatsHint")}</p>
          </div>
          <PawScale value={profile.sociabilityCats} onChange={readOnly ? undefined : (v) => update({ sociabilityCats: v })} />
        </div>

        {/* Energy */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">{t("behavioral.energyLevel")}</p>
            <p className="text-[10px] text-muted-foreground">{t("behavioral.energyLevelHint")}</p>
          </div>
          <PawScale value={profile.energyLevel} onChange={readOnly ? undefined : (v) => update({ energyLevel: v })} />
        </div>
      </div>

      {/* Tri-state */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">{t("behavioral.sociabilityChildren")}</p>
          <TriStatePicker value={profile.sociabilityChildren} onChange={readOnly ? undefined : (v) => update({ sociabilityChildren: v })} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">{t("behavioral.sociabilityDogs")}</p>
          <TriStatePicker value={profile.sociabilityDogs} onChange={readOnly ? undefined : (v) => update({ sociabilityDogs: v })} />
        </div>
      </div>

      {/* Alone tolerance slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-foreground">{t("behavioral.aloneTolerance")}</p>
          <span className="text-xs font-bold text-primary">⏱ {profile.aloneToleranceHours}h</span>
        </div>
        {readOnly ? (
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(profile.aloneToleranceHours / 10) * 100}%` }} />
          </div>
        ) : (
          <input
            type="range" min={0} max={10} step={1}
            value={profile.aloneToleranceHours}
            onChange={(e) => update({ aloneToleranceHours: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        )}
        <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
          <span>0h</span><span>5h</span><span>10h</span>
        </div>
      </div>

      {/* Vocality */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">{t("behavioral.vocality")}</p>
        <div className="flex gap-1.5">
          {(["silent", "normal", "vocal"] as Vocality[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => !readOnly && update({ vocality: v })}
              disabled={readOnly}
              className={`flex-1 rounded-xl border py-1.5 text-[10px] font-bold transition-colors ${
                profile.vocality === v ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"
              } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              {t(`behavioral.vocality_${v}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Affection style */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">{t("behavioral.affectionStyle")}</p>
        <div className="flex gap-1.5">
          {(["avoids", "accepts", "seeks"] as AffectionStyle[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => !readOnly && update({ affectionStyle: a })}
              disabled={readOnly}
              className={`flex-1 rounded-xl border py-1.5 text-[10px] font-bold transition-colors ${
                profile.affectionStyle === a ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"
              } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              {t(`behavioral.affection_${a}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Special behaviors checklist */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">{t("behavioral.specialBehaviors")}</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SPECIAL_BEHAVIORS.map((b) => {
            const active = profile.specialBehaviors?.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => !readOnly && toggleBehavior(b)}
                disabled={readOnly}
                className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold transition-colors ${
                  active ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"
                } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
              >
                {active ? "✓ " : ""}{t(`behavioral.behavior_${b}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BehavioralProfileForm;
