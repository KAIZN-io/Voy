"""save your data in a data file

Returns:
    [type]: [description]
"""

import os

import pandas as pd
import pdfkit



def DictToPdf(query_as_dict: dict = {}, file_name: str = '', path: str = '.') -> str:
    """
    Convertes a dictionary to a PDF
    """

    path_tmp    = os.path.join(path, "{}.html".format(file_name))
    path_output = os.path.join(path, "{}.pdf".format(file_name))

    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    # query_DataFrame.to_html("/server/.log_files/query_DataFrame.html")
    query_DataFrame.to_html(path_tmp)

    # convert the html file into pdf with wkhtmltopdf
    pdfkit.from_file(path_tmp, path_output)

    # Clean up
    os.remove(path_tmp)

    return path_output


def DictToExcel(query_as_dict: dict = {}, file_name: str = '', path: str = '.') -> str:
    """
    Convertes a dictionary to an Excel file
    """

    path_output = os.path.join(path, "{}.xlsx".format(file_name))

    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    query_DataFrame.to_excel(path_output)

    return path_output
