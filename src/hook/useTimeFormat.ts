import { useEnvStore } from "../EnvStore";

interface Props {
  time: string;
}

export default function useTimeFormat() {
  const { envState } = useEnvStore();

  const timeFormatMMDD = (props: Readonly<Props>) => {
    const localeTime = new Date(props.time).toLocaleString(
      envState.timeLocale,
      {
        timeZone: envState.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    );
    const month = localeTime.slice(6, 8);
    const day = localeTime.slice(10, 12);

    return `${month}.${day}`;
  };

  return { timeFormatMMDD };
}
