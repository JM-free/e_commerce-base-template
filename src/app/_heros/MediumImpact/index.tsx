import React from 'react'

import { Page } from '../../../payload/payload-types'
import { FeatureImage, FeatureImageGrid } from '../../_components/FeatureImageGrid'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const MediumImpactHero: React.FC<
  Page['hero'] & { featureImages?: FeatureImage[] }
> = props => {
  const { richText, media, links, featureImages } = props

  return (
    <Gutter className={classes.hero}>
      <div className={classes.background}>
        <RichText className={classes.richText} content={richText} />
        {Array.isArray(links) && (
          <ul className={classes.links}>
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink className={classes.link} {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className={classes.media}>
        {typeof media === 'object' && <Media className={classes.media} resource={media} />}
      </div>
      <FeatureImageGrid images={featureImages} />
    </Gutter>
  )
}
