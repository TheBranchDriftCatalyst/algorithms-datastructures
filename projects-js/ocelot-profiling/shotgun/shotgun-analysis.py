import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
pd.options.display.html.table_schema = True
pd.options.display.max_rows = None
# Helper Functions here


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
        # .highlight_max(axis=1, color='#cf4152', subset=color_subset) \
        # .highlight_min(axis=0, color='#2d88db', subset=color_subset)
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


def load_data(dataset_name, indices=['trace_id', 'service_name', 'id']):
    return pd.read_json('../output/raws/{}.json'.format(dataset_name), convert_dates=False) \
        .set_index(keys=indices) \
        .drop(axis=1, labels=['isRoot'])


def decile_by(frame, by='total_profile_time', cutter=pd.qcut, aggs='mean'):
    frame['decile'] = cutter(frame[by], 10, labels=False, duplicates='drop').rename('decile')
    decile_sizes = frame.groupby('decile').size().rename('bucket_size')
    decile_summary = frame.groupby('decile').agg(aggs)
    decile_summary['bucket_size'] = decile_sizes
    return decile_summary
def get_post_and_pre_status_counts(post, pre):
    post['version'] = 'post'
    pre['version'] = 'pre'
    return pd.concat((pre, post)).groupby(['status', 'version'])[['sv_name']]
# ./output/madhuri-post.json


post = pd.read_json('./output/madhuri-post.json', convert_dates=False)
pre = pd.read_json('./output/madhuri-pre.json', convert_dates=False)

get_post_and_pre_status_counts(post, pre).count()

t = pd.concat((pre, post))
t
pd.concat((post, pre)).groupby('sv_name')
