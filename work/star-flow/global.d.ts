interface FieldConfig {
  type: String; // type to find supported form control component
  name: String; // Name - label of control
  valueField: String; // path to value from object values. Ex: line1.color
  opacityField?: String; // For color field, if specify, it will enable alpha and set value on change
  inline: Boolean; // inline mod or block
  showLabel: Boolean; // show label or not
  labelCol: Number; // col for label
  col: Number; // col for control
  props: Object; // props pass to control (min, max, className,...)
}
