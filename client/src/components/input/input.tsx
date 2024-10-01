interface Type {
    id: string;
    type: string;
    label: string;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    color?: string
}

function Input({ id, input, setInput,label, type, color }: Type) {

    const style: React.CSSProperties = {
        color: color,
    }

    return (
        <div className='relative w-full'>
            <input style={{
                ...style,
                borderBottomWidth: '1px',
                borderColor: color,
                borderStyle: 'solid'
            }} onChange={(event) => setInput(event.target.value)} value={input} type={type} id={id} className="block p-6 pb-2 px-0 w-full text-base font-medium bg-transparent focus:outline-none peer" placeholder=" " autoComplete='off' required />
            <label style={style} htmlFor={id} className="absolute cursor-text font-medium top-0 text-sm left-0 transition-all duration-200 peer-focus:text-sm peer-focus:top-0 peer-placeholder-shown:text-base peer-placeholder-shown:top-4">{label}</label>
        </div>
    )
}

export default Input
