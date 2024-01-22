import { Box, useStyleConfig } from '@chakra-ui/react';
import React from 'react';

function PanelContent(props: any) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig('PanelContent', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}

export default PanelContent;
