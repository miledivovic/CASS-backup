/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2017 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

var ContactAcceptModal = function(grant, close) {
    EcModal.call(this);
    this.grant = grant;
    this.closeEvent = close;
};
ContactAcceptModal = stjs.extend(ContactAcceptModal, EcModal, [], function(constructor, prototype) {
    prototype.closeEvent = null;
    prototype.modalSize = "small";
    prototype.grant = null;
    prototype.onClose = function() {
        if (this.closeEvent != null) 
            this.closeEvent();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/contactAccept.html";
    };
}, {closeEvent: "Callback0", grant: "EcContactGrant"}, {});
