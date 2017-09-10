// const browserActions = require('./extensions/browserActions')
// const contextMenus = require('./extensions/contextMenus')
const fs = require('fs-extra')
const path = require('path')
const chromeExtensionPath = require('../../lib/extension/chromeExtensionPath')
const {BrowserWindow,componentUpdater,app} = require('electron')
// Takes Content Security Policy flags, for example { 'default-src': '*' }
// Returns a CSP string, for example 'default-src: *;'
let concatCSP = (cspDirectives) => {
  let csp = ''
  for (let directive in cspDirectives) {
    csp += directive + ' ' + cspDirectives[directive] + '; '
  }
  return csp.trim()
}



module.exports.init = (verChange) => {
//   browserActions.init()
//   contextMenus.init()

  const {componentUpdater, session} = require('electron')
  componentUpdater.on('component-checking-for-updates', () => {
    // console.log('checking for update')
  })
  componentUpdater.on('component-update-found', () => {
    // console.log('update-found')
  })
  componentUpdater.on('component-update-ready', () => {
    // console.log('update-ready')
  })
  componentUpdater.on('component-update-updated', (e, extensionId, version) => {
    // console.log('update-updated', extensionId, version)
  })
  componentUpdater.on('component-ready', (e, componentId, extensionPath) => {
    // console.log('component-ready', componentId, extensionPath)
    // Re-setup the loadedExtensions info if it exists
    // loadExtension(componentId, extensionPath)
  })
  componentUpdater.on('component-not-updated', () => {
    // console.log('update-not-updated')
  })
  componentUpdater.on('component-registered', (e, extensionId) => {
    // const extensionPath = extensions.getIn([extensionId, 'filePath'])
    // // If we don't have info on the extension yet, check for an update / install
    // if (!extensionPath) {
    //   componentUpdater.checkNow(extensionId)
    // } else {
    //   loadExtension(extensionId, extensionPath)
    // }
  })

  process.on('reload-sync-extension', () => {
    console.log('reloading sync')
    // disableExtension(config.syncExtensionId)
  })

  process.on('extension-load-error', (error) => {
    console.error(error)
  })

  process.on('extension-unloaded', (extensionId) => {
    // if (extensionId === config.syncExtensionId) {
    //   // Reload sync extension to restart the background script
    //   setImmediate(() => {
    //     enableExtension(config.syncExtensionId)
    //   })
    // }
  })

  process.on('extension-ready', (installInfo) => {
    require('../../lib/extensionInfos').setInfo(installInfo)
    // extensionInfo.setState(installInfo.id, extensionStates.ENABLED)
    // extensionInfo.setInstallInfo(installInfo.id, installInfo)
    // installInfo.filePath = installInfo.base_path
    // installInfo.base_path = fileUrl(installInfo.base_path)
    // extensionActions.extensionInstalled(installInfo.id, installInfo)
    // extensionActions.extensionEnabled(installInfo.id)
  })

  let loadExtension = (ses,extensionId, extensionPath, manifest = {}, manifestLocation = 'unpacked') => {
    extensionPath = extensionPath.replace('app.asar/','app.asar.unpacked/')
    console.log(path.join(extensionPath, 'manifest.json'))
    fs.exists(path.join(extensionPath, 'manifest.json'), (exists) => {
      if (exists) {
        ses.extensions.load(extensionPath, manifest, manifestLocation)
      } else {
        // This is an error condition, but we can recover.
        // extensionInfo.setState(extensionId, undefined)
        componentUpdater.checkNow(extensionId)
      }
    })
  }

  let enableExtension = (extensionId) => {
    session.defaultSession.extensions.enable(extensionId)
  }

  let disableExtension = (extensionId) => {
    session.defaultSession.extensions.disable(extensionId)
  }

  let getPath = (appId) => {
    const extRootPath = path.join(app.getPath('userData'),'resource/extension')
    // const extRootPath = path.join(__dirname,'../../resource/extension').replace('app.asar/','app.asar.unpacked/')
    if(!fs.existsSync(extRootPath)) {
      fs.mkdirSync(extRootPath)
    }
    const appPath = path.join(extRootPath,appId)
    const orgPath = path.join(__dirname,'../../resource/extension',appId).replace('app.asar/','app.asar.unpacked/')
    if(verChange || true || !fs.existsSync(appPath)){
      if(fs.existsSync(orgPath)){
        fs.copySync(orgPath, appPath)
      }
      else{
        const dirPath = chromeExtensionPath(appId)
        fs.copySync(dirPath, appPath)
      }
    }
    const version = fs.readdirSync(appPath).sort().pop()
    const basePath = path.join(appPath,version)
    return [appId,basePath]
  }

  let registerComponent = (extensionId) => {
    // if (!extensionInfo.isRegistered(extensionId) && !extensionInfo.isRegistering(extensionId)) {
    //   extensionInfo.setState(extensionId, extensionStates.REGISTERING)
    //   componentUpdater.registerComponent(extensionId)
    // } else {
    //   const extensions = extensionState.getExxttensions(appStore.getState())
    //   const extensionPath = extensions.getIn([extensionId, 'filePath'])
    //   if (extensionPath) {
    //     // Otheriwse just install it
    //     loadExtension(extensionId, extensionPath)
    //   }
    // }
  }

  require('./browserAction')

  let first = true
  module.exports.loadAll = function(ses){
    loadExtension(ses,...getPath('jpkfjicglakibpenojifdiepckckakgk'),(void 0),'component')
    loadExtension(ses,'dckpbojndfoinamcdamhkjhnjnmjkfjd',getPath('default')[1],(void 0),'component')
    loadExtension(ses,...getPath('jdbefljfgobbmcidnmpjamcbhnbphjnb'),(void 0),'component')
    componentUpdater.registerComponent('jdbefljfgobbmcidnmpjamcbhnbphjnb', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqmqh6Kxmj00IjKvjPsCtw6g2BHvKipjS3fBD0IInXZZ57u5oZfw6q42L7tgWDLrNDPvu3XDH0vpECr+IcgBjkM+w6+2VdTyPj5ubngTwvBqCIPItetpsZNJOJfrFw0OIgmyekZYsI+BsK7wiMtHczwfKSTi0JKgrwIRhHbEhpUnCxFhi+zI61p9jwMb2EBFwxru7MtpP21jG7pVznFeLV9W9BkNL1Th9QBvVs7GvZwtIIIniQkKtqT1wp4IY9/mDeM5SgggKakumCnT9D37ZxDnM2K13BKAXOkeH6JLGrZCl3aXmqDO9OhLwoch+LGb5IaXwOZyGnhdhm9MNA3hgEwIDAQAB')
    if(process.platform != 'win32'){
      loadExtension(ses,...getPath('occjjkgifpmdgodlplnacmkejpdionan'),(void 0),'component')
    }

    const appIds = fs.readFileSync(path.join(__dirname,'../../resource/extensions.txt').replace('app.asar/','app.asar.unpacked/')).toString().split(/\r?\n/)
    for(let appId of appIds) {
      if(appId.match(/^[a-z]+$/)){
        if(!first && appId == 'niloccemoadcdkdjlinkgdfekeahmflj') continue
        loadExtension(ses,...getPath(appId))
      }
    }
    first = false
  }
  module.exports.loadAll(session.defaultSession)
  // loadExtension(...getPath('occjjkgifpmdgodlplnacmkejpdionan'))
  // loadExtension(...getPath('aeolcjbaammbkgaiagooljfdepnjmkfd'))
  // loadExtension(...getPath('khpcanbeojalbkpgpmjpdkjnkfcgfkhb'))
  // loadExtension(...getPath('niloccemoadcdkdjlinkgdfekeahmflj'))
  // loadExtension(...getPath('aapbdbdomjkkjkaonfhkkikfgjllcleb'))
}
