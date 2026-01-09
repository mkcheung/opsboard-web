import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks/hooks";
import type {
    NextAction,
    OpenTasks,
    ProjectAttention,
    SortableTask,
    Tile,
    TileKey,
    TimeWindow,
    UpcomingDay,
} from "./DashboardTypes";
import {
    PRIORITY_RANK,
    STATUS_RANK
} from "./DashboardTypes";
import type {
    Project
} from "../Projects/projectTypes";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function badgeToneFromDueLabel(label: string | undefined): "danger" | "warn" | "info" | "neutral" {
    const u = label ? label.toUpperCase() : '';
    if (u.includes("OVERDUE")) return "danger";
    if (u.includes("TODAY")) return "warn";
    if (u.includes("TOMORROW")) return "info";
    return "neutral";
}

const Dashboard = () => {
    const navigate = useNavigate();
    const projectsAndTasks = useAppSelector((s) => s.project.projects)

    const [timeWindow, setTimeWindow] = useState<TimeWindow>("7d");
    const [activeTile, setActiveTile] = useState<TileKey | null>(null);
    const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({});
    const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
    const [activeDay, setActiveDay] = useState<string | null>(null);

    const OPEN_STATUSES = ["todo", "doing"] as const;

    const isOpen = (status: string) => OPEN_STATUSES.includes(status as any);

    const diffDaysFromToday = (due_date: string | null | undefined): number | null => {
        if (!due_date) return null;
        const todayTime = getStartOfDateLocal().getTime();
        const [y, m, d] = due_date.split("-").map(Number);
        const dueDateNum = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
        return Math.floor((dueDateNum - todayTime) / MS_PER_DAY);
    };

    const getBucket = (dueTime: number | null, todayStart: number, soonDays = 7): number => {
        if (dueTime == null) return 4;

        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.floor((dueTime - todayStart) / oneDay);

        if (diffDays < 0) return 0;
        if (diffDays === 0) return 1;
        if (diffDays <= soonDays) return 2;
        return 3;
    }

    const parseTimeOrZero = (iso?: string | null): number => {
        if (!iso) return 0;
        const t = Date.parse(iso);
        return Number.isFinite(t) ? t : 0;
    }

    const parseTimesFromCurrentDate = (due_date: string | null, forTiles: boolean = true) => {
        if (!due_date) {
            return;
        }
        let todayTime = getStartOfDateLocal().getTime();
        let [y, m, d] = due_date.split("-").map(Number);
        let dueDateNum = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
        const numDays = Math.floor((dueDateNum - todayTime) / MS_PER_DAY);
        if (!forTiles) {
            return (dueDateNum < todayTime) ? 'OVERDUE' : (numDays === 0 ? 'TODAY' : (numDays > 1 ? `${numDays} DAYS` : `TOMORROW`));
        } else {
            return (dueDateNum < todayTime) ? 'OVERDUE' : (numDays === 0 ? 'TODAY' : (timeWindow === "7d" && numDays <= 7 ? `NEXTSEVEN` : (timeWindow === "30d" && numDays <= 30 ? `NEXTTHIRTY` : '')));
        }
    }

    const getStartOfDateLocal = () => {
        const currentDateTime = new Date();
        return new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), 23, 59, 59, 999);
    }

    const parseYMDLocal = (ymd: string | null | undefined) => {
        if (!ymd) {
            return null;
        }
        const [y, m, d] = ymd.split('-').map(Number);
        return new Date(y, m - 1, d, 23, 59, 59, 999);
    }

    const translateYYYYMMDDToDate = (YYYYMMDD: string) => {
        if (!YYYYMMDD) {
            return "";
        }

        const date = new Date(YYYYMMDD + "T00:00:00");
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    const sortTasks = (taskA: SortableTask, taskB: SortableTask) => {
        const todayStart = getStartOfDateLocal().getTime();

        const dueA = parseYMDLocal(taskA.due_date)?.getTime() ?? null;
        const dueB = parseYMDLocal(taskB.due_date)?.getTime() ?? null;

        const bucketA = getBucket(dueA, todayStart, 7);
        const bucketB = getBucket(dueB, todayStart, 7);
        if (bucketA !== bucketB) return bucketA - bucketB;

        if (dueA != null && dueB != null && dueA !== dueB) return dueA - dueB;

        const prA = PRIORITY_RANK[taskA.priority];
        const prB = PRIORITY_RANK[taskB.priority];
        if (prA !== prB) return prA - prB;

        const stA = STATUS_RANK[taskA.status];
        const stB = STATUS_RANK[taskB.status];
        if (stA !== stB) return stA - stB;

        const updA = parseTimeOrZero(taskA.updated_at);
        const updB = parseTimeOrZero(taskB.updated_at);
        if (updA !== updB) return updB - updA;

        const crA = parseTimeOrZero(taskA.created_at);
        const crB = parseTimeOrZero(taskB.created_at);
        if (crA !== crB) return crA - crB;

        return 0;
    };

    const formatDateToYearMonthDay = (date: Date): string => {

        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const getDatesDaysAhead = (removeCurrentDay: boolean = false): string[] => {
        let daysAhead = []
        const today = getStartOfDateLocal();
        const numDaysAhead = (timeWindow === "7d" ? 7 : 30);
        let i = removeCurrentDay ? 1 : 0;
        for (i; i <= numDaysAhead; i++) {
            let aheadDate = new Date(today);
            aheadDate.setDate(today.getDate() + i);
            daysAhead[i] = formatDateToYearMonthDay(aheadDate);
        }
        return daysAhead;
    }

    const getTiles = (psAndTs: Project[]) => {
        let tiles: Tile[] = [];
        let overdueCount = 0;
        let todayCount = 0;
        let duePeriodCount = 0;
        let openCount = 0;
        const daysAhead = getDatesDaysAhead();

        psAndTs.forEach(pAndTs => {
            let projectTasks = pAndTs.tasks;
            projectTasks.forEach(task => {
                let dueLabel = parseTimesFromCurrentDate(task.due_date ?? null, true)
                if (task.status !== 'done') {
                    openCount++;
                }
                switch (dueLabel) {
                    case 'OVERDUE':
                        overdueCount++;
                        break;
                    case 'TODAY':
                        todayCount = task.due_date && daysAhead.includes(task.due_date) ? todayCount + 1 : todayCount;
                        break;
                    case 'NEXTSEVEN':
                    case 'NEXTTHIRTY':
                        duePeriodCount = task.due_date && daysAhead.includes(task.due_date) ? duePeriodCount + 1 : duePeriodCount;
                        break;
                    default:
                        break;
                }
            });
        });
        tiles.push(
            { key: "overdue", label: "Overdue", value: overdueCount, tone: "danger" },
            { key: "due_today", label: "Due Today", value: todayCount, tone: "warn" },
            { key: `${timeWindow === 'today' ? 'due_today' : (timeWindow === '7d' ? 'due_7d' : 'due_30d')}`, label: `${timeWindow === 'today' ? 'Due Today' : (timeWindow === '7d' ? 'Due Next 7 Days' : 'Due Next 30 Days')}`, value: timeWindow === 'today' ? todayCount : duePeriodCount, tone: "info" },
            { key: "open_tasks", label: "Open Tasks", value: openCount, tone: "success" },
        )
        return tiles;
    }

    const tiles: Tile[] = useMemo(
        () => {
            const tileItems = getTiles(projectsAndTasks);
            return tileItems;
        },
        [projectsAndTasks, timeWindow]
    );

    const getNextActions = (psAndTs: Project[]) => {
        const allOpenTasks: OpenTasks[] = [];

        psAndTs.forEach((p) => {
            const projectTasks = p.tasks ?? [];
            projectTasks.forEach((t) => {
                if (!isOpen(t.status)) return;
                allOpenTasks.push({
                    ...(t as OpenTasks),
                    projectName: p.name,
                });
            });
        });

        const filtered = allOpenTasks.filter((t) => {
            if (activeDay) {
                return t.due_date === activeDay;
            }

            const daysFromToday = diffDaysFromToday(t.due_date);

            if (activeTile) {
                if (activeTile === "open_tasks") {
                    return true;
                }
                if (daysFromToday == null)
                    return false;

                switch (activeTile) {
                    case "overdue":
                        return daysFromToday < 0;
                    case "due_today":
                        return daysFromToday === 0;
                    case "due_7d":
                        return daysFromToday >= 0 && daysFromToday <= 7;
                    case "due_30d":
                        return daysFromToday >= 0 && daysFromToday <= 30;
                }

                return true;
            }

            if (daysFromToday == null) {
                return false;
            }
            if (daysFromToday < 0) {
                return true;
            }
            if (timeWindow === "today") {
                return daysFromToday === 0;
            }
            if (timeWindow === "7d") {
                return daysFromToday <= 7;
            }
            return daysFromToday <= 30;
        });

        const sorted = [...filtered].sort(sortTasks);

        const top = sorted.slice(0, 12);

        return top
            .filter((t) => t.id && t.priority)
            .map((t) => {
                const dueLabel = t.due_date ? parseTimesFromCurrentDate(t.due_date, false) : "";
                return {
                    id: Number(t.id),
                    title: t.title,
                    projectId: t.project_id,
                    projectName: (t as any).projectName,
                    dueLabel: dueLabel,
                    priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
                };
            });
    };

    const nextActions: NextAction[] = useMemo(
        () => getNextActions(projectsAndTasks),
        [projectsAndTasks, activeDay, activeTile, timeWindow]
    );

    const buildProjectAttention = (psAndTs: Project[]) => {
        let projectAttention: ProjectAttention[] = [];
        psAndTs.forEach((pAndT: Project) => {
            const psTasks = pAndT.tasks
            const projectId = pAndT.id;
            const projectName = pAndT.name;
            let overdueCount = 0;
            let dueSoonCount = 0;
            let openCount = 0;
            psTasks.forEach((task) => {
                if (!isOpen(task.status)) {
                    return;
                }
                openCount++;

                if (!task.due_date) {
                    return;
                }

                const daysFromToday = diffDaysFromToday(task.due_date);
                if (daysFromToday == null) {
                    return;
                }

                if (daysFromToday < 0) {
                    overdueCount++;
                } else if (daysFromToday <= 7) {
                    dueSoonCount++;
                }
            });
            projectAttention.push({
                id: projectId,
                name: projectName,
                overdue: overdueCount,
                dueSoon: dueSoonCount,
                open: openCount
            });
        });
        return projectAttention;
    }

    const projects: ProjectAttention[] = useMemo(
        () => {
            const projectsToTasks = buildProjectAttention(projectsAndTasks);
            return projectsToTasks
        },
        [projectsAndTasks]
    );

    const convertDateToDayAndDayNumber = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const dayOptions: Intl.DateTimeFormatOptions = { weekday: "short" };
        const monthOptions: Intl.DateTimeFormatOptions = { month: "short" };
        const dayOfWeek = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
        const month = new Intl.DateTimeFormat('en-US', monthOptions).format(date);
        const dayNumber = date.getDate();
        return `${dayOfWeek} ${month} ${dayNumber}`;
    }

    const buildUpcoming = (psAndTs: Project[]) => {
        const upcomingDays: UpcomingDay[] = [];

        const today = getStartOfDateLocal();
        const nextSevenDays: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i + 1);
            nextSevenDays.push(formatDateToYearMonthDay(d));
        }

        nextSevenDays.forEach((dateString) => {
            let dueCount = 0;

            psAndTs.forEach((pAndT) => {
                const psTasks = pAndT.tasks ?? [];
                psTasks.forEach((task) => {
                    if (!isOpen(task.status)) return;
                    if (dateString === task.due_date) dueCount++;
                });
            });

            upcomingDays.push({
                id: dateString,
                label: convertDateToDayAndDayNumber(dateString),
                dueCount,
            });
        });

        return upcomingDays;
    };

    const upcoming: UpcomingDay[] = useMemo(
        () => buildUpcoming(projectsAndTasks),
        [projectsAndTasks]
    );

    return (
        <div>
            <div className="pageHeader">
                <h1 className="h1">Dashboard</h1>

                <div className="pageHeaderRight dashHeaderControls">
                    <button
                        className={`chip ${timeWindow === "today" ? "chipActive" : ""}`}
                        onClick={() => setTimeWindow("today")}
                        type="button"
                    >
                        Today
                    </button>
                    <button
                        className={`chip ${timeWindow === "7d" ? "chipActive" : ""}`}
                        onClick={() => setTimeWindow("7d")}
                        type="button"
                    >
                        Next 7 Days
                    </button>
                    <button
                        className={`chip ${timeWindow === "30d" ? "chipActive" : ""}`}
                        onClick={() => setTimeWindow("30d")}
                        type="button"
                    >
                        30 Days
                    </button>
                </div>
            </div>

            <div className="dashTiles">
                {tiles.map((t) => {
                    const isActive = activeTile === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            className={`dashTileBtn ${isActive ? "dashTileBtnActive" : ""}`}
                            onClick={() => {
                                setActiveDay(null);
                                setActiveTile((prev) => (prev === t.key ? null : t.key));
                            }}
                            aria-label={`${t.label}: ${t.value}`}
                        >
                            <div className={`card dashTile dashTileTone-${t.tone ?? "neutral"}`}>
                                <div className="cardBody dashTileBody">
                                    <div className="dashTileLabel">{t.label}</div>
                                    <div className="dashTileValue">{t.value}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="dashGrid">
                <div className="card">
                    <div className="cardBody">
                        <div className="dashCardHeader">
                            <div>
                                <div className="dashCardTitle">Next Actions</div>
                                <div className="mutedText dashCardHint">Most urgent tasks across all projects</div>
                            </div>

                            <button
                                className="btn btnGhost"
                                type="button"
                                onClick={() => {
                                    setActiveTile(null);
                                    setActiveDay(null);
                                }}
                            >
                                Clear filters
                            </button>
                        </div>

                        <div className="dashList">
                            {nextActions.map((task) => {
                                const idKey = String(task.id);
                                const checked = !!checkedTasks[idKey];
                                const tone = badgeToneFromDueLabel(task.dueLabel);

                                return (
                                    <div key={idKey} className="dashRow">
                                        <label className="dashCheck">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) =>
                                                    setCheckedTasks((prev) => ({ ...prev, [idKey]: e.target.checked }))
                                                }
                                            />
                                            <span className="dashCheckBox" aria-hidden="true" />
                                        </label>

                                        <div className="dashRowMain">
                                            <button
                                                type="button"
                                                className={`taskTitleBtn ${checked ? "taskTitleDone" : ""}`}
                                                onClick={() => {
                                                    // UI only: you’ll replace this with opening TaskDetailsDrawer
                                                    // navigate(`/tasks/${task.id}`) if you ever add a route
                                                    console.log("open task", task.id);
                                                }}
                                            >
                                                {task.title}
                                            </button>

                                            <div className="dashRowSub">
                                                <button
                                                    type="button"
                                                    className="dashProjectLink rowLink"
                                                    onClick={() => navigate(`/projects/${task.projectId}`)}
                                                >
                                                    {task.projectName}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="dashRowRight">
                                            <span className={`badge badgeTone-${tone}`}>{task.dueLabel}</span>
                                            {task.priority ? <span className="badge">{task.priority}</span> : null}
                                            <span className="dashChevron" aria-hidden="true">›</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {nextActions.length === 0 ? (
                                <div className="taskEmpty mutedText">{activeDay ? `No tasks due on ${translateYYYYMMDDToDate(activeDay)}` : 'No tasks due'}</div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Right: Projects needing attention */}
                <div className="card">
                    <div className="cardBody">
                        <div className="dashCardHeader">
                            <div>
                                <div className="dashCardTitle">Projects Needing Attention</div>
                                <div className="mutedText dashCardHint">Ordered by urgency (you’ll compute the score)</div>
                            </div>
                        </div>

                        <div className="dashList">
                            {projects && projects.map((p) => {
                                const idKey = String(p.id);
                                const collapsed = !!collapsedProjects[idKey];

                                return (
                                    <div key={idKey} className="dashProject">
                                        <div className="dashProjectTop">
                                            <button
                                                type="button"
                                                className="dashProjectName"
                                                onClick={() => navigate(`/projects/${p.id}`)}
                                            >
                                                {p.name}
                                            </button>

                                            <div className="dashProjectControls">
                                                <button
                                                    type="button"
                                                    className="btn btnGhost"
                                                    onClick={() =>
                                                        setCollapsedProjects((prev) => ({ ...prev, [idKey]: !prev[idKey] }))
                                                    }
                                                >
                                                    {collapsed ? "Show" : "Hide"}
                                                </button>
                                                <span className="dashChevron" aria-hidden="true">›</span>
                                            </div>
                                        </div>

                                        {!collapsed && (
                                            <div className="dashProjectStats">
                                                <div className="dashStat">
                                                    <div className="dashStatNum dashDanger">{p.overdue}</div>
                                                    <div className="dashStatLabel mutedText">Overdue</div>
                                                </div>
                                                <div className="dashStat">
                                                    <div className="dashStatNum dashWarn">{p.dueSoon}</div>
                                                    <div className="dashStatLabel mutedText">Due soon</div>
                                                </div>
                                                <div className="dashStat">
                                                    <div className="dashStatNum">{p.open}</div>
                                                    <div className="dashStatLabel mutedText">Open</div>
                                                </div>

                                                {typeof p.progressPct === "number" ? (
                                                    <div className="dashProgress">
                                                        <div className="dashProgressTop">
                                                            <span className="mutedText">Progress</span>
                                                            <span className="dashProgressValue">{p.progressPct}%</span>
                                                        </div>
                                                        <div className="dashProgressBar" aria-hidden="true">
                                                            <div className="dashProgressFill" style={{ width: `${p.progressPct}%` }} />
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {projects && projects.length === 0 ? (
                                <div className="taskEmpty mutedText">No projects to show.</div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="cardBody">
                    <div className="dashCardHeader">
                        <div>
                            <div className="dashCardTitle">Upcoming</div>
                            <div className="mutedText dashCardHint">Agenda-style view (v1)</div>
                        </div>
                    </div>

                    <div className="dashUpcoming">
                        {upcoming.map((d) => {
                            const isActive = activeDay === d.id;
                            return (
                                <button
                                    key={d.id}
                                    type="button"
                                    className={`dashUpcomingRow ${isActive ? "dashUpcomingRowActive" : ""}`}
                                    onClick={() => {
                                        setActiveTile(null);
                                        setActiveDay((prev) => (prev === d.id ? null : d.id));
                                    }}
                                >
                                    <div className="dashUpcomingLeft">
                                        <div className="dashUpcomingDay">{d.label}</div>
                                        <div className="mutedText dashUpcomingHint">
                                            {d.dueCount === 0 ? "No tasks" : `${d.dueCount} due`}
                                        </div>
                                    </div>

                                    <div className="dashUpcomingRight">
                                        <span className="dashChevron" aria-hidden="true">›</span>
                                    </div>
                                </button>
                            );
                        })}

                        {upcoming.length === 0 ? (
                            <div className="taskEmpty mutedText">Nothing upcoming.</div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
