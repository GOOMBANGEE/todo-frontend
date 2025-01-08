interface Props {
  time: string;
}

export default function useTimeFormat() {
  const timeFormatMMDD = (props: Readonly<Props>) => {
    const localeTime = props.time.toLocaleString();
    // const year = localeTime.slice(0, 4);
    const month = localeTime.slice(5, 7);
    const day = localeTime.slice(8, 10);
    // const hour = Number(localeTime.slice(11, 13));
    // const minute = localeTime.slice(14, 16);

    return `${month}.${day}`;
  };

  const timeFormatYYMMDD = (props: Readonly<Props>) => {
    const localeTime = props.time.toLocaleString();
    const year = localeTime.slice(0, 4);
    const month = localeTime.slice(5, 7);
    const day = localeTime.slice(8, 10);

    return `${year}.${month}.${day}`;
  };

  return { timeFormatMMDD, timeFormatYYMMDD };
}
