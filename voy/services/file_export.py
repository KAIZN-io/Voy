import os
from pathlib import Path

import pdfkit
from pandas import DataFrame

from voy.constants import FILE_TYPE_PDF, FILE_TYPE_XLSX


def export_dict_list(dict_list: list, file_path: Path, file_name: str, file_type: str) -> str:
    # Make sure the output path exists
    file_path.mkdir(parents=True, exist_ok=True)

    # Convert the dict list to a Pandas Data Frame
    dict_list_data_frame = DataFrame(dict_list)

    if file_type == FILE_TYPE_PDF:
        return export_data_frame_as_pdf(dict_list_data_frame, file_path, file_name)
    elif file_type == FILE_TYPE_XLSX:
        return export_data_frame_as_excel(dict_list_data_frame, file_path, file_name)
    else:
        raise ValueError('Unsupported file type.')


def export_data_frame_as_pdf(data_frame: DataFrame, file_path: Path, file_name: str) -> str:
    """ Converts a list of Tickets to a PDF
    """

    # Generate the temporary and output path
    path_tmp = os.path.join(file_path, "{}.html".format(file_name))
    path_output = os.path.join(file_path, "{}.pdf".format(file_name))

    # Convert the DataFrame to HTML and then render the HTML to a PDF.
    data_frame.to_html(path_tmp)
    pdfkit.from_file(path_tmp, path_output)

    # Clean up; Remove the temporary HTML file.
    os.remove(path_tmp)

    return path_output


def export_data_frame_as_excel(data_frame: DataFrame, file_path: Path, file_name: str) -> str:
    """ Converts a list of Tickets to an Excel file
    """

    # Generate the output path
    path_output = os.path.join(file_path, "{}.xlsx".format(file_name))

    # Convert the DataFrame to an Excel file
    data_frame.to_excel(path_output)

    return path_output
