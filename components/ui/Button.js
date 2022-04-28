const Button = (props) => {
  const ButtonType = props.href ? `a` : `button`;
  let styles = 'relative inline-flex items-center border border-transparent text-xs md:text-lg font-semibold rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';

  //Sizing styles
  if(props.small){
    styles = styles + ' px-4 py-2'
  } if(props.medium){
    styles = styles + ' px-5 py-3'
  } else {
    styles = styles + ' px-8 py-3'
  }

  //Color styles
  if(props.secondary){
    styles = styles + ' text-white bg-secondary border-secondary-2'
  } else if(props.tertiary){
    styles = styles + ' bg-tertiary border-tertiary-2'
  } else {
    styles = styles + ' bg-primary border-primary-2'
  }

  return(
    <ButtonType 
      disabled={props.disabled && props.disabled}
      onClick={props.onClick && props.onClick}
      href={props.href && props.href}
      className={`${styles} ${props.className ? props.className : ''}`}
    >
      {props.children && props.children}
    </ButtonType>
  )
}

export default Button;