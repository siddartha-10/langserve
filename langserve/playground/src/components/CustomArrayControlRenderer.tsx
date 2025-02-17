// From https://github.com/eclipsesource/jsonforms/blob/44070b325121ad7173082fdf33be079f42ef96c4/packages/material/src/complex/MaterialArrayControlRenderer.tsx
/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { useCallback, useState } from "react";
import {
  ArrayLayoutProps,
  RankedTester,
  isObjectArrayControl,
  isObjectArrayWithNesting,
  isPrimitiveArrayControl,
  or,
  rankWith,
} from "@jsonforms/core";
import { withJsonFormsArrayLayoutProps } from "@jsonforms/react";
import { MaterialTableControl } from "./MaterialTableControl";
import { Hidden } from "@mui/material";
import { DeleteDialog } from "./DeleteDialog";

export const MaterialArrayControlRenderer = (props: ArrayLayoutProps) => {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string | undefined>(undefined);
  const [rowData, setRowData] = useState<number | undefined>(undefined);
  const { removeItems, visible } = props;

  const openDeleteDialog = useCallback(
    (p: string, rowIndex: number) => {
      setOpen(true);
      setPath(p);
      setRowData(rowIndex);
    },
    [setOpen, setPath, setRowData]
  );

  const deleteCancel = useCallback(() => setOpen(false), [setOpen]);
  const deleteConfirm = useCallback(() => {
    const p = path?.substring(0, path.lastIndexOf("."));
    if (p != null && rowData != null) removeItems?.(p, [rowData])();
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOpen, path, rowData]);

  const deleteClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div className="control">
      <Hidden xsUp={!visible}>
        <MaterialTableControl {...props} openDeleteDialog={openDeleteDialog} />
        <DeleteDialog
          open={open}
          onCancel={deleteCancel}
          onConfirm={deleteConfirm}
          onClose={deleteClose}
          acceptText={props.translations.deleteDialogAccept!}
          declineText={props.translations.deleteDialogDecline!}
          title={props.translations.deleteDialogTitle!}
          message={props.translations.deleteDialogMessage!}
        />
      </Hidden>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const materialArrayControlTester: RankedTester = rankWith(
  999,
  or(isObjectArrayControl, isPrimitiveArrayControl, isObjectArrayWithNesting)
);

// eslint-disable-next-line react-refresh/only-export-components
export default withJsonFormsArrayLayoutProps(MaterialArrayControlRenderer);
