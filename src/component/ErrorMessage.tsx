interface Props {
  message: string | undefined;
}

export default function ErrorMessage(props: Readonly<Props>) {
  return (
    <div className={`text-sm text-red-500 ${props.message ? "" : "hidden"}`}>
      {props.message}
    </div>
  );
}
