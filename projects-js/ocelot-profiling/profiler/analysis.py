import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# Helper Functions here


def convert_size(size):
    # 2**10 = 1024
    power = 2**10
    n = 0
    Dic_powerN = {0: '', 1: 'k', 2: 'm', 3: 'g', 4: 't'}
    while size > power:
        size /= power
        n += 1
    return size, Dic_powerN[n] + 'b'


def create_table(dframe, save_name=None, precision=4, color_subset=None):
    # cm = sns.light_palette('green', as_cmap=True)
    # th_props = [
    #     ('text-align', 'center'),
    #     ('font-weight', 'bold'),
    # ]

    # # Set CSS properties for td elements in dataframe
    # td_props = [
    #     # ('font-size', '11px')
    # ]
    #
    # # Set table styles
    # styles = [
    #     dict(selector="th", props=th_props),
    #     # dict(selector="td", props=td_props)
    # ]
    table = dframe.style \
        .format("{:.4f}") \
        .highlight_max(axis=0, color='#cf4152', subset=color_subset) \
        .highlight_min(axis=0, color='#2d88db', subset=color_subset)
    # .background_gradient(cmap=cm, subset=color_subset)
    # .set_table_styles(styles)
    if save_name:
        with open(save_name + '.html', 'w') as f:
            f.write(table.render())
            f.close()
            pass
    return table


def create_heatmap(corr_frame):
    fig, ax = plt.subplots(figsize=(10, 10))
    mask = np.zeros_like(corr_frame, dtype=np.bool)
    mask[np.triu_indices_from(mask)] = True
    cmap = sns.diverging_palette(220, 10, as_cmap=True)
    return sns.heatmap(
        corr_frame,
        mask=mask,
        cmap=cmap,
        annot=True,
        fmt='.3f',
        vmax=.5,
        center=0,
        square=True,
        linewidths=.5,
        ax=ax).get_figure()


def load_data(dataset_name):
    return pd.read_json(dataset_name, convert_dates=False) \
        .set_index(keys=['trace_id', 'service_name', 'id']) \
        .drop(axis=1, labels=['isRoot'])


def decile_by(frame, by='total_profile_time', cutter=pd.qcut, aggs='mean'):
    frame['decile'] = cutter(frame[by], 10, labels=False, duplicates='drop').rename('decile')
    decile_sizes = frame.groupby('decile').size().rename('bucket_size')
    decile_summary = frame.groupby('decile').agg(aggs).replace(0, np.nan).dropna(axis=1, how='all')
    decile_summary['bucket_size'] = decile_sizes
    return decile_summary

#######################################################################################################################
# START ANALYSIS ######################################################################################################
#######################################################################################################################

# Clean up the raw dataset a bit
# df = load_data('prod_v_0_data-normalized')
pre_df = pd.read_json('./output/sbx_pre-normalized.json', convert_dates=False)
post_df = pd.read_json('./output/sbx_post-normalized.json', convert_dates=False)

pre_df.plot.scatter(x='profile_time', y='total_profile_time', secondary_y='service_name')
post_df.plot.scatter(x='profile_time', y='total_profile_time')

pre_df.groupby('service_name').describe().stack()
post_df.groupby('service_name').describe().stack()

pre_df = pre_df.groupby('service_name').mean()[['total_profile_time', 'profile_time']]
post_df = post_df.groupby('service_name').mean()[['total_profile_time', 'profile_time']]

pre_df['version'] = 'pre'
post_df['version'] = 'post'

pd.concat((pre_df, post_df)).pivot(columns='version').dropna(how='all').stack()
