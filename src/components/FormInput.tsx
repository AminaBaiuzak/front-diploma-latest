import InputMask from "@mona-health/react-input-mask";

export default function FormInput(props: { label: string; id: string; type: string; onChange?: (e: any) => void }) {
  return (
    <div className="bg-[#36719314] rounded-lg flex flex-col w-[50%] overflow-hidden px-[17px] py-1">
      <label htmlFor={props.id} className="font-outfit text-[12px] text-[#403A4B99]">
        {props.label}
      </label>
      {props.type === "tel" ? (
        <InputMask
          mask="+7 999 999 99 99"
          type={props.type}
          id={props.id}
          className="bg-transparent text-[14px] font-outfit w-full outline-none text-main"
          onChange={props.onChange}
        />
      ) : (
        <input type={props.type} id={props.id} className="bg-transparent text-[14px] font-outfit w-full outline-none text-main" onChange={props.onChange} />
      )}
    </div>
  );
}
